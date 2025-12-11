import mongoose, { Document, Schema } from 'mongoose';

export interface IReviewDocument extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    order?: mongoose.Types.ObjectId;
    rating: number;
    title: string;
    comment: string;
    images: string[];
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    helpfulCount: number;
    helpfulVotes: mongoose.Types.ObjectId[];
    adminResponse?: string;
    adminResponseAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new Schema<IReviewDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        title: {
            type: String,
            required: [true, 'Review title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        comment: {
            type: String,
            required: [true, 'Review comment is required'],
            trim: true,
            maxlength: [2000, 'Comment cannot exceed 2000 characters'],
        },
        images: [{
            type: String,
        }],
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
        isApproved: {
            type: Boolean,
            default: true,
        },
        helpfulCount: {
            type: Number,
            default: 0,
        },
        helpfulVotes: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        adminResponse: String,
        adminResponseAt: Date,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ createdAt: -1 });

// Compound index to prevent duplicate reviews
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to calculate average rating for a product
reviewSchema.statics.calculateAverageRating = async function (productId: mongoose.Types.ObjectId) {
    const result = await this.aggregate([
        { $match: { product: productId, isApproved: true } },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 },
            },
        },
    ]);

    if (result.length > 0) {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            averageRating: Math.round(result[0].averageRating * 10) / 10,
            reviewCount: result[0].reviewCount,
        });
    } else {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            averageRating: 0,
            reviewCount: 0,
        });
    }
};

// Update product rating after save
reviewSchema.post('save', async function () {
    await (this.constructor as any).calculateAverageRating(this.product);
});

// Update product rating after delete
reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await (mongoose.model('Review') as any).calculateAverageRating(doc.product);
    }
});

export const Review = mongoose.model<IReviewDocument>('Review', reviewSchema);

export default Review;
