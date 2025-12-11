import { Router } from 'express';
import * as orderController from '../../controllers/order.controller';
import { authenticate, validate, orderLimiter } from '../../middleware';
import { createOrderSchema, cancelOrderSchema } from '../../validators';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

// All order routes require authentication
router.use(authenticate);

router.get('/', orderController.getOrders);
router.get('/:orderNumber', orderController.getOrder);
router.post('/', orderLimiter, validate(createOrderSchema), orderController.createOrder);
router.post('/:orderNumber/cancel', validate(cancelOrderSchema), orderController.cancelOrder);

// Public tracking route (no auth required)
router.get('/:orderNumber/track', orderController.trackOrder);

export default router;
