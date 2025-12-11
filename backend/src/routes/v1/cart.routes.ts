import { Router } from 'express';
import * as cartController from '../../controllers/cart.controller';
import { optionalAuth, validate } from '../../middleware';
import { addToCartSchema, updateCartItemSchema, applyCouponSchema } from '../../validators';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart endpoints
 */

// All routes use optional auth (supports both logged in and guest users)
router.get('/', optionalAuth, cartController.getCart);
router.post('/items', optionalAuth, validate(addToCartSchema), cartController.addToCart);
router.put('/items/:itemId', optionalAuth, validate(updateCartItemSchema), cartController.updateCartItem);
router.delete('/items/:itemId', optionalAuth, cartController.removeFromCart);
router.delete('/', optionalAuth, cartController.clearCart);
router.post('/coupon', optionalAuth, validate(applyCouponSchema), cartController.applyCoupon);
router.delete('/coupon', optionalAuth, cartController.removeCoupon);

export default router;
