import { Router } from 'express';
import * as productController from '../../controllers/product.controller';
import { authenticate, requireAdmin, validate, optionalAuth } from '../../middleware';
import { createProductSchema, updateProductSchema, productQuerySchema } from '../../validators';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

// Public routes
router.get('/', validate(productQuerySchema, 'query'), productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/best-sellers', productController.getBestSellers);
router.get('/:idOrSlug', productController.getProduct);
router.get('/:id/related', productController.getRelatedProducts);

// Admin routes
router.post('/', authenticate, requireAdmin, validate(createProductSchema), productController.createProduct);
router.put('/:id', authenticate, requireAdmin, validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', authenticate, requireAdmin, productController.deleteProduct);

export default router;
