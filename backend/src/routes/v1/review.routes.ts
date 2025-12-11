import { Router } from 'express';
import * as reviewController from '../../controllers/review.controller';
import { authenticate, optionalAuth, validate } from '../../middleware';
import { createReviewSchema, updateReviewSchema } from '../../validators';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product review endpoints
 */

// Public routes
router.get('/products/:productId/reviews', reviewController.getProductReviews);

// Protected routes
router.get('/my-reviews', authenticate, reviewController.getMyReviews);
router.post('/products/:productId/reviews', authenticate, validate(createReviewSchema), reviewController.createReview);
router.put('/:reviewId', authenticate, validate(updateReviewSchema), reviewController.updateReview);
router.delete('/:reviewId', authenticate, reviewController.deleteReview);
router.post('/:reviewId/helpful', authenticate, reviewController.markHelpful);

export default router;
