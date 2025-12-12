import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItemDocument {
    _id?: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    addedAt: Date;
}

export interface ICartDocument extends Document {
    _id: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
    sessionId?: string;
    items: ICartItemDocument[];
    couponCode?: string;
    couponDiscount: number;
    createdAt: Date;
    updatedAt: Date;
    subtotal: number;
    itemCount: number;
}

const cartItemSchema = new Schema<ICartItemDocument>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'],
            max: [99, 'Quantity cannot exceed 99'],
        },
        price: {
            type: Number,
            required: true,
            min: [0, 'Price cannot be negative'],
        },
        addedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: true }
);

const cartSchema = new Schema<ICartDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        sessionId: {
            type: String,
        },
        items: [cartItemSchema],
        couponCode: String,
        couponDiscount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for subtotal
cartSchema.virtual('subtotal').get(function () {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

// Virtual for item count
cartSchema.virtual('itemCount').get(function () {
    return this.items.reduce((count, item) => count + item.quantity, 0);
});

// Indexes
cartSchema.index({ user: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // 30 days TTL for guest carts

// Pre-validate to ensure either user or sessionId exists
cartSchema.pre('validate', function (next) {
    if (!this.user && !this.sessionId) {
        next(new Error('Cart must have either a user or session ID'));
    } else {
        next();
    }
});

export const Cart = mongoose.model<ICartDocument>('Cart', cartSchema);

export default Cart;
