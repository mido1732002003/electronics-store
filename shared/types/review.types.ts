import { IUser } from './user.types';
import { IProduct } from './product.types';

export interface IReview {
    id: string;
    user: Pick<IUser, 'id' | 'firstName' | 'lastName' | 'avatar'>;
    product: Pick<IProduct, 'id' | 'name' | 'slug'>;
    rating: number;
    title: string;
    comment: string;
    images?: string[];
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IReviewCreate {
    productId: string;
    rating: number;
    title: string;
    comment: string;
    images?: string[];
}

export interface IReviewUpdate {
    rating?: number;
    title?: string;
    comment?: string;
    images?: string[];
}

export interface IReviewListResponse {
    reviews: IReview[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    averageRating: number;
    ratingDistribution: IRatingDistribution;
}

export interface IRatingDistribution {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
}

export interface IReviewFilter {
    productId?: string;
    userId?: string;
    rating?: number;
    isApproved?: boolean;
    isVerifiedPurchase?: boolean;
    sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
    page?: number;
    limit?: number;
}
