import { Router } from 'express';
import v1Routes from './v1';

const router = Router();

// API version 1
router.use('/v1', v1Routes);

// Default route
router.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Electronics Store API',
        version: '1.0.0',
        documentation: '/api-docs',
    });
});

export default router;
