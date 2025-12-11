import mongoose, { Document, Schema } from 'mongoose';

export type CouponType = 'percentage' | 'fixed';

export interface ICouponDocument extends Document {
    _id: mongoose.Types.ObjectId;
    code: string;
    description: string;
    type: CouponType;
    value: number;
    minimumPurchase: number;
    maximumDiscount?: number;
    usageLimit: number;
    usedCount: number;
    usagePerUser: number;
    usedBy: { user: mongoose.Types.ObjectId; usedAt: Date }[];
    applicableProducts: mongoose.Types.ObjectId[];
    applicableCategories: mongoose.Types.ObjectId[];
    excludedProducts: mongoose.Types.ObjectId[];
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    isValid: boolean;
    isExpired: boolean;
    remainingUses: number;
}

const couponSchema = new Schema<ICouponDocument>(
    {
        code: {
            type: String,
            required: [true, 'Coupon code is required'],
            unique: true,
            uppercase: true,
            trim: true,
            maxlength: [20, 'Coupon code cannot exceed 20 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [200, 'Description cannot exceed 200 characters'],
        },
        type: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: [true, 'Coupon type is required'],
        },
        value: {
            type: Number,
            required: [true, 'Coupon value is required'],
            min: [0, 'Value cannot be negative'],
        },
        minimumPurchase: {
            type: Number,
            default: 0,
            min: [0, 'Minimum purchase cannot be negative'],
        },
        maximumDiscount: {
            type: Number,
            min: [0, 'Maximum discount cannot be negative'],
        },
        usageLimit: {
            type: Number,
            default: 0, // 0 = unlimited
            min: [0, 'Usage limit cannot be negative'],
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        usagePerUser: {
            type: Number,
            default: 1,
            min: [1, 'Usage per user must be at least 1'],
        },
        usedBy: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            usedAt: {
                type: Date,
                default: Date.now,
            },
        }],
        applicableProducts: [{
            type: Schema.Types.ObjectId,
            ref: 'Product',
        }],
        applicableCategories: [{
            type: Schema.Types.ObjectId,
            ref: 'Category',
        }],
        excludedProducts: [{
            type: Schema.Types.ObjectId,
            ref: 'Product',
        }],
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for validity
couponSchema.virtual('isValid').get(function () {
    const now = new Date();
    return (
        this.isActive &&
        now >= this.startDate &&
        now <= this.endDate &&
        (this.usageLimit === 0 || this.usedCount < this.usageLimit)
    );
});

// Virtual for expired status
couponSchema.virtual('isExpired').get(function () {
    return new Date() > this.endDate;
});

// Virtual for remaining uses
couponSchema.virtual('remainingUses').get(function () {
    if (this.usageLimit === 0) return Infinity;
    return Math.max(0, this.usageLimit - this.usedCount);
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });

// Validate percentage value
couponSchema.pre('save', function (next) {
    if (this.type === 'percentage' && this.value > 100) {
        next(new Error('Percentage discount cannot exceed 100%'));
    } else {
        next();
    }
});

export const Coupon = mongoose.model<ICouponDocument>('Coupon', couponSchema);

export default Coupon;
