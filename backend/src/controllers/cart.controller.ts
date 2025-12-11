import { Request, Response } from 'express';
import { Cart, Product, Coupon } from '../models';
import { ApiResponse, ApiError, asyncHandler, calculateSubtotal, calculateShipping, calculateTax, calculateDiscount, calculateTotal } from '../utils';

/**
 * @swagger
 * /cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get current user's cart
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Cart contents }
 */
export const getCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];

    let cart;
    if (userId) {
        cart = await Cart.findOne({ user: userId }).populate('items.product');
    } else if (sessionId) {
        cart = await Cart.findOne({ sessionId }).populate('items.product');
    }

    if (!cart) {
        return ApiResponse.success(res, {
            items: [],
            subtotal: 0,
            itemCount: 0,
            summary: {
                subtotal: 0,
                shipping: 0,
                tax: 0,
                discount: 0,
                total: 0,
            },
        });
    }

    const subtotal = calculateSubtotal(cart.items.map(item => ({ price: item.price, quantity: item.quantity })));
    const shipping = calculateShipping(subtotal, cart.itemCount);
    const tax = calculateTax(subtotal);
    const discount = cart.couponDiscount || 0;
    const total = calculateTotal(subtotal, shipping, tax, discount);

    return ApiResponse.success(res, {
        id: cart._id,
        items: cart.items,
        subtotal,
        itemCount: cart.itemCount,
        couponCode: cart.couponCode,
        couponDiscount: cart.couponDiscount,
        summary: {
            subtotal,
            shipping,
            tax,
            discount,
            total,
        },
    });
});

/**
 * @swagger
 * /cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId: { type: string }
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       200: { description: Item added to cart }
 *       400: { description: Product not available }
 */
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    const userId = req.user?._id;
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'] || `session_${Date.now()}`;

    // Check product availability
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
        throw ApiError.badRequest('Product not found or not available');
    }

    if (product.quantity < quantity) {
        throw ApiError.badRequest(`Only ${product.quantity} items available in stock`);
    }

    // Find or create cart
    let cart;
    if (userId) {
        cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }
    } else {
        cart = await Cart.findOne({ sessionId });
        if (!cart) {
            cart = await Cart.create({ sessionId, items: [] });
        }
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
        // Update quantity
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
        if (newQuantity > product.quantity) {
            throw ApiError.badRequest(`Only ${product.quantity} items available in stock`);
        }
        cart.items[existingItemIndex].quantity = newQuantity;
        cart.items[existingItemIndex].price = product.price;
    } else {
        // Add new item
        cart.items.push({
            product: product._id,
            quantity,
            price: product.price,
            addedAt: new Date(),
        });
    }

    await cart.save();
    await cart.populate('items.product');

    return ApiResponse.success(res, cart, 'Item added to cart');
});

/**
 * @swagger
 * /cart/items/{itemId}:
 *   put:
 *     tags: [Cart]
 *     summary: Update cart item quantity
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       200: { description: Cart item updated }
 */
export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?._id;
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];

    let cart;
    if (userId) {
        cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
        cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
        throw ApiError.notFound('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => item._id?.toString() === itemId);
    if (itemIndex === -1) {
        throw ApiError.notFound('Item not found in cart');
    }

    // Check product availability
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product || product.quantity < quantity) {
        throw ApiError.badRequest('Requested quantity not available');
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price;

    await cart.save();
    await cart.populate('items.product');

    return ApiResponse.success(res, cart, 'Cart updated');
});

/**
 * @swagger
 * /cart/items/{itemId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove item from cart
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Item removed from cart }
 */
export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const userId = req.user?._id;
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];

    let cart;
    if (userId) {
        cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
        cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
        throw ApiError.notFound('Cart not found');
    }

    cart.items = cart.items.filter(item => item._id?.toString() !== itemId);

    await cart.save();
    await cart.populate('items.product');

    return ApiResponse.success(res, cart, 'Item removed from cart');
});

/**
 * @swagger
 * /cart:
 *   delete:
 *     tags: [Cart]
 *     summary: Clear the cart
 *     responses:
 *       200: { description: Cart cleared }
 */
export const clearCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];

    if (userId) {
        await Cart.findOneAndUpdate({ user: userId }, { items: [], couponCode: null, couponDiscount: 0 });
    } else if (sessionId) {
        await Cart.findOneAndUpdate({ sessionId }, { items: [], couponCode: null, couponDiscount: 0 });
    }

    return ApiResponse.success(res, { items: [], subtotal: 0, itemCount: 0 }, 'Cart cleared');
});

/**
 * @swagger
 * /cart/coupon:
 *   post:
 *     tags: [Cart]
 *     summary: Apply coupon to cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [couponCode]
 *             properties:
 *               couponCode: { type: string }
 *     responses:
 *       200: { description: Coupon applied }
 *       400: { description: Invalid coupon }
 */
export const applyCoupon = asyncHandler(async (req: Request, res: Response) => {
    const { couponCode } = req.body;
    const userId = req.user?._id;
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];

    // Find cart
    let cart;
    if (userId) {
        cart = await Cart.findOne({ user: userId }).populate('items.product');
    } else if (sessionId) {
        cart = await Cart.findOne({ sessionId }).populate('items.product');
    }

    if (!cart || cart.items.length === 0) {
        throw ApiError.badRequest('Cart is empty');
    }

    // Find and validate coupon
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

    if (!coupon) {
        throw ApiError.badRequest('Invalid coupon code');
    }

    if (!coupon.isValid) {
        if (coupon.isExpired) {
            throw ApiError.badRequest('Coupon has expired');
        }
        throw ApiError.badRequest('Coupon is not valid');
    }

    // Check minimum purchase
    const subtotal = calculateSubtotal(cart.items.map(item => ({ price: item.price, quantity: item.quantity })));
    if (subtotal < coupon.minimumPurchase) {
        throw ApiError.badRequest(`Minimum purchase of $${coupon.minimumPurchase} required for this coupon`);
    }

    // Check user usage limit
    if (userId) {
        const userUsage = coupon.usedBy.filter(u => u.user.toString() === userId.toString()).length;
        if (userUsage >= coupon.usagePerUser) {
            throw ApiError.badRequest('You have already used this coupon');
        }
    }

    // Calculate discount
    const discount = calculateDiscount(subtotal, coupon.type, coupon.value, coupon.maximumDiscount);

    // Apply to cart
    cart.couponCode = coupon.code;
    cart.couponDiscount = discount;
    await cart.save();

    return ApiResponse.success(res, {
        couponCode: coupon.code,
        discount,
        message: `Coupon applied! You saved $${discount.toFixed(2)}`,
    }, 'Coupon applied successfully');
});

/**
 * @swagger
 * /cart/coupon:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove coupon from cart
 *     responses:
 *       200: { description: Coupon removed }
 */
export const removeCoupon = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];

    if (userId) {
        await Cart.findOneAndUpdate({ user: userId }, { couponCode: null, couponDiscount: 0 });
    } else if (sessionId) {
        await Cart.findOneAndUpdate({ sessionId }, { couponCode: null, couponDiscount: 0 });
    }

    return ApiResponse.success(res, null, 'Coupon removed');
});

export default {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
};
