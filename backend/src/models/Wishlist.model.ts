import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlistDocument extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    products: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlistDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        products: [{
            type: Schema.Types.ObjectId,
            ref: 'Product',
        }],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for product count
wishlistSchema.virtual('productCount').get(function () {
    return this.products.length;
});

// Indexes
wishlistSchema.index({ user: 1 });

export const Wishlist = mongoose.model<IWishlistDocument>('Wishlist', wishlistSchema);

export default Wishlist;
