import { Request, Response } from 'express';
import { Review, Product, Order } from '../models';
import { ApiResponse, ApiError, asyncHandler, getPagination } from '../utils';

/**
 * @swagger
 * /products/{productId}/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get reviews for a product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of reviews }
 */
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { page, limit, skip } = getPagination(req.query);
    const { rating, sort = 'newest' } = req.query;

    const filter: Record<string, unknown> = { product: productId, isApproved: true };
    if (rating) {
        filter.rating = parseInt(rating as string, 10);
    }

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        highest: { rating: -1 },
        lowest: { rating: 1 },
        helpful: { helpfulCount: -1 },
    };

    const [reviews, total] = await Promise.all([
        Review.find(filter)
            .populate('user', 'firstName lastName avatar')
            .sort(sortOptions[sort as string] || sortOptions.newest)
            .skip(skip)
            .limit(limit)
            .lean(),
        Review.countDocuments(filter),
    ]);

    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
        { $match: { product: productId, isApproved: true } },
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
    ]);

    const distribution = {
        5: 0, 4: 0, 3: 0, 2: 0, 1: 0,
    };
    ratingDistribution.forEach(r => {
        distribution[r._id as keyof typeof distribution] = r.count;
    });

    const totalPages = Math.ceil(total / limit);
    return ApiResponse.success(res, {
        reviews,
        ratingDistribution: distribution,
    }, 'Success', 200, {
        page,
        limit,
        total,
        totalPages,
    });
});

/**
 * @swagger
 * /products/{productId}/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review for a product
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Review created }
 */
export const createReview = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user!._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw ApiError.notFound('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
        throw ApiError.conflict('You have already reviewed this product');
    }

    // Check if user has purchased this product
    const order = await Order.findOne({
        user: userId,
        'items.product': productId,
        status: 'delivered',
    });

    const review = await Review.create({
        user: userId,
        product: productId,
        order: order?._id,
        rating,
        title,
        comment,
        isVerifiedPurchase: !!order,
    });

    await review.populate('user', 'firstName lastName avatar');

    return ApiResponse.created(res, review, 'Review submitted successfully');
});

/**
 * @swagger
 * /reviews/{reviewId}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update a review
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Review updated }
 */
export const updateReview = asyncHandler(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user!._id;

    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
        throw ApiError.notFound('Review not found');
    }

    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();
    await review.populate('user', 'firstName lastName avatar');

    return ApiResponse.success(res, review, 'Review updated successfully');
});

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Review deleted }
 */
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user!._id;

    const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });
    if (!review) {
        throw ApiError.notFound('Review not found');
    }

    return ApiResponse.success(res, null, 'Review deleted successfully');
});

/**
 * @swagger
 * /reviews/{reviewId}/helpful:
 *   post:
 *     tags: [Reviews]
 *     summary: Mark review as helpful
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Marked as helpful }
 */
export const markHelpful = asyncHandler(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user!._id;

    const review = await Review.findById(reviewId);
    if (!review) {
        throw ApiError.notFound('Review not found');
    }

    const alreadyVoted = review.helpfulVotes.includes(userId);

    if (alreadyVoted) {
        // Remove vote
        review.helpfulVotes = review.helpfulVotes.filter(id => !id.equals(userId));
        review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
        // Add vote
        review.helpfulVotes.push(userId);
        review.helpfulCount += 1;
    }

    await review.save();

    return ApiResponse.success(res, {
        helpfulCount: review.helpfulCount,
        voted: !alreadyVoted,
    }, alreadyVoted ? 'Vote removed' : 'Marked as helpful');
});

/**
 * @swagger
 * /reviews/my-reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get user's reviews
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of user's reviews }
 */
export const getMyReviews = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { page, limit, skip } = getPagination(req.query);

    const [reviews, total] = await Promise.all([
        Review.find({ user: userId })
            .populate('product', 'name slug images')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Review.countDocuments({ user: userId }),
    ]);

    return ApiResponse.paginated(res, reviews, total, page, limit);
});

export default {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    getMyReviews,
};
