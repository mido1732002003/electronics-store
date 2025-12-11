import { Router } from 'express';
import * as userController from '../../controllers/user.controller';
import { authenticate, validate } from '../../middleware';
import { changePasswordSchema } from '../../validators';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and settings endpoints
 */

// All routes require authentication
router.use(authenticate);

// Profile
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/avatar', userController.uploadAvatar);
router.post('/change-password', validate(changePasswordSchema), userController.changePassword);

// Dashboard
router.get('/dashboard', userController.getDashboard);

// Addresses
router.get('/addresses', userController.getAddresses);
router.post('/addresses', userController.addAddress);
router.put('/addresses/:id', userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);

// Wishlist
router.get('/wishlist', userController.getWishlist);
router.post('/wishlist/:productId', userController.addToWishlist);
router.delete('/wishlist/:productId', userController.removeFromWishlist);

export default router;
