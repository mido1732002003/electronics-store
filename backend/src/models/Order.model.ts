import mongoose, { Document, Schema } from 'mongoose';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../enums';

export interface IOrderAddress {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
}

export interface IOrderItemDocument {
    product: mongoose.Types.ObjectId;
    name: string;
    sku: string;
    image: string;
    price: number;
    quantity: number;
    total: number;
}

export interface IPaymentDetails {
    transactionId?: string;
    gateway?: string;
    last4?: string;
    brand?: string;
    receiptUrl?: string;
    paidAt?: Date;
}

export interface IOrderDocument extends Document {
    _id: mongoose.Types.ObjectId;
    orderNumber: string;
    user: mongoose.Types.ObjectId;
    items: IOrderItemDocument[];
    shippingAddress: IOrderAddress;
    billingAddress: IOrderAddress;
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    paymentDetails?: IPaymentDetails;
    stripePaymentIntentId?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    notes?: string;
    internalNotes?: string;
    couponCode?: string;
    couponDiscount: number;
    estimatedDelivery?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
    refundedAt?: Date;
    refundAmount?: number;
    createdAt: Date;
    updatedAt: Date;
}

const orderAddressSchema = new Schema<IOrderAddress>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        company: String,
        address1: { type: String, required: true },
        address2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
    },
    { _id: false }
);

const orderItemSchema = new Schema<IOrderItemDocument>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: { type: String, required: true },
        sku: { type: String, required: true },
        image: { type: String, required: true },
        price: {
            type: Number,
            required: true,
            min: [0, 'Price cannot be negative'],
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'],
        },
        total: {
            type: Number,
            required: true,
            min: [0, 'Total cannot be negative'],
        },
    },
    { _id: true }
);

const paymentDetailsSchema = new Schema<IPaymentDetails>(
    {
        transactionId: String,
        gateway: String,
        last4: String,
        brand: String,
        receiptUrl: String,
        paidAt: Date,
    },
    { _id: false }
);

const orderSchema = new Schema<IOrderDocument>(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: function (items: IOrderItemDocument[]) {
                    return items.length > 0;
                },
                message: 'Order must have at least one item',
            },
        },
        shippingAddress: {
            type: orderAddressSchema,
            required: true,
        },
        billingAddress: {
            type: orderAddressSchema,
            required: true,
        },
        subtotal: {
            type: Number,
            required: true,
            min: [0, 'Subtotal cannot be negative'],
        },
        shippingCost: {
            type: Number,
            required: true,
            min: [0, 'Shipping cost cannot be negative'],
            default: 0,
        },
        tax: {
            type: Number,
            required: true,
            min: [0, 'Tax cannot be negative'],
            default: 0,
        },
        discount: {
            type: Number,
            min: [0, 'Discount cannot be negative'],
            default: 0,
        },
        total: {
            type: Number,
            required: true,
            min: [0, 'Total cannot be negative'],
        },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
        paymentMethod: {
            type: String,
            enum: Object.values(PaymentMethod),
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.PENDING,
        },
        paymentDetails: paymentDetailsSchema,
        stripePaymentIntentId: String,
        trackingNumber: String,
        trackingUrl: String,
        notes: String,
        internalNotes: String,
        couponCode: String,
        couponDiscount: {
            type: Number,
            default: 0,
        },
        estimatedDelivery: Date,
        shippedAt: Date,
        deliveredAt: Date,
        cancelledAt: Date,
        cancellationReason: String,
        refundedAt: Date,
        refundAmount: Number,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'items.product': 1 });

// Generate order number before saving
orderSchema.pre('save', async function (next) {
    if (this.isNew && !this.orderNumber) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.orderNumber = `ORD-${timestamp}-${random}`;
    }
    next();
});

export const Order = mongoose.model<IOrderDocument>('Order', orderSchema);

export default Order;
