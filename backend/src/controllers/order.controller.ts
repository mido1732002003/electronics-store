import { Request, Response } from 'express';
import { Order, Cart, Product, Coupon } from '../models';
import { ApiResponse, ApiError, asyncHandler, getPagination, calculateSubtotal, calculateShipping, calculateTax, calculateDiscount, calculateTotal, sendOrderConfirmationEmail } from '../utils';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../enums';
import { createPaymentIntent } from '../config/stripe';
import { config } from '../config';

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get user's orders
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of orders }
 */
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { page, limit, skip } = getPagination(req.query);
    const { status } = req.query;

    const filter: Record<string, unknown> = { user: userId };
    if (status) {
        filter.status = status;
    }

    const [orders, total] = await Promise.all([
        Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Order.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, orders, total, page, limit);
});

/**
 * @swagger
 * /orders/{orderNumber}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by order number
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Order details }
 *       404: { description: Order not found }
 */
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
    const { orderNumber } = req.params;
    const userId = req.user!._id;

    const order = await Order.findOne({ orderNumber, user: userId })
        .populate('items.product', 'name slug images');

    if (!order) {
        throw ApiError.notFound('Order not found');
    }

    return ApiResponse.success(res, order);
});

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Order created }
 *       400: { description: Cart is empty }
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { shippingAddress, billingAddress, paymentMethod, couponCode, notes, useSameAddress } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        throw ApiError.badRequest('Cart is empty');
    }

    // Verify all products are available
    const orderItems = [];
    for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (!product || !product.isActive) {
            throw ApiError.badRequest(`Product ${item.product} is no longer available`);
        }
        if (product.quantity < item.quantity) {
            throw ApiError.badRequest(`Insufficient stock for ${product.name}`);
        }

        orderItems.push({
            product: product._id,
            name: product.name,
            sku: product.sku,
            image: product.primaryImage || '',
            price: product.price,
            quantity: item.quantity,
            total: product.price * item.quantity,
        });
    }

    // Calculate totals
    const subtotal = calculateSubtotal(orderItems.map(i => ({ price: i.price, quantity: i.quantity })));
    const shipping = calculateShipping(subtotal, orderItems.reduce((sum, i) => sum + i.quantity, 0));
    const tax = calculateTax(subtotal);

    let discount = 0;
    let appliedCoupon = null;

    // Apply coupon if provided
    if (couponCode) {
        appliedCoupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (appliedCoupon && appliedCoupon.isValid) {
            discount = calculateDiscount(subtotal, appliedCoupon.type, appliedCoupon.value, appliedCoupon.maximumDiscount);
        }
    }

    const total = calculateTotal(subtotal, shipping, tax, discount);

    // Create order
    const order = await Order.create({
        user: userId,
        items: orderItems,
        shippingAddress,
        billingAddress: useSameAddress ? shippingAddress : billingAddress,
        subtotal,
        shippingCost: shipping,
        tax,
        discount,
        total,
        status: OrderStatus.PENDING,
        paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        couponCode: appliedCoupon?.code,
        couponDiscount: discount,
        notes,
    });

    // Handle payment
    let paymentData = null;
    if (paymentMethod === PaymentMethod.STRIPE || paymentMethod === PaymentMethod.CREDIT_CARD) {
        try {
            const paymentIntent = await createPaymentIntent({
                amount: Math.round(total * 100), // Convert to cents
                currency: 'usd',
                metadata: {
                    orderId: order._id.toString(),
                    orderNumber: order.orderNumber,
                },
            });

            order.stripePaymentIntentId = paymentIntent.id;
            await order.save();

            paymentData = {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            };
        } catch (error) {
            console.error('Stripe payment intent creation failed:', error);
            throw ApiError.internal('Payment processing failed');
        }
    }

    // Reduce product quantities
    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { quantity: -item.quantity, soldCount: item.quantity },
        });
    }

    // Update coupon usage
    if (appliedCoupon) {
        await Coupon.findByIdAndUpdate(appliedCoupon._id, {
            $inc: { usedCount: 1 },
            $push: { usedBy: { user: userId, usedAt: new Date() } },
        });
    }

    // Clear cart
    await Cart.findByIdAndUpdate(cart._id, { items: [], couponCode: null, couponDiscount: 0 });

    // Send confirmation email
    try {
        await sendOrderConfirmationEmail(req.user!.email, {
            firstName: req.user!.firstName,
            orderNumber: order.orderNumber,
            orderDate: order.createdAt.toLocaleDateString(),
            items: orderItems.map(i => ({ name: i.name, quantity: i.quantity, price: `$${i.price.toFixed(2)}` })),
            subtotal: `$${subtotal.toFixed(2)}`,
            shipping: shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`,
            tax: `$${tax.toFixed(2)}`,
            total: `$${total.toFixed(2)}`,
            shippingAddress: `${shippingAddress.firstName} ${shippingAddress.lastName}, ${shippingAddress.address1}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}`,
            orderUrl: `${config.urls.frontend}/orders/${order.orderNumber}`,
        });
    } catch (error) {
        console.error('Failed to send order confirmation email:', error);
    }

    return ApiResponse.created(res, {
        order: {
            id: order._id,
            orderNumber: order.orderNumber,
            total: order.total,
            status: order.status,
            paymentStatus: order.paymentStatus,
        },
        payment: paymentData,
    }, 'Order created successfully');
});

/**
 * @swagger
 * /orders/{orderNumber}/cancel:
 *   post:
 *     tags: [Orders]
 *     summary: Cancel an order
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Order cancelled }
 */
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
    const { orderNumber } = req.params;
    const { reason } = req.body;
    const userId = req.user!._id;

    const order = await Order.findOne({ orderNumber, user: userId });

    if (!order) {
        throw ApiError.notFound('Order not found');
    }

    // Only allow cancellation for pending/confirmed orders
    if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)) {
        throw ApiError.badRequest('Order cannot be cancelled at this stage');
    }

    // Restore product quantities
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { quantity: item.quantity, soldCount: -item.quantity },
        });
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    order.cancellationReason = reason;
    await order.save();

    return ApiResponse.success(res, order, 'Order cancelled successfully');
});

/**
 * @swagger
 * /orders/{orderNumber}/track:
 *   get:
 *     tags: [Orders]
 *     summary: Track order status
 *     responses:
 *       200: { description: Order tracking info }
 */
export const trackOrder = asyncHandler(async (req: Request, res: Response) => {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber }).select(
        'orderNumber status shippedAt deliveredAt trackingNumber trackingUrl estimatedDelivery createdAt'
    );

    if (!order) {
        throw ApiError.notFound('Order not found');
    }

    return ApiResponse.success(res, {
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        estimatedDelivery: order.estimatedDelivery,
    });
});

export default {
    getOrders,
    getOrder,
    createOrder,
    cancelOrder,
    trackOrder,
};
