import swaggerJSDoc from 'swagger-jsdoc';
import { config } from './index';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Electronics Store API',
        version: '1.0.0',
        description: 'REST API documentation for Electronics Store e-commerce platform',
        contact: {
            name: 'API Support',
            email: 'support@electronics-store.com',
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    servers: [
        {
            url: `http://localhost:${config.port}/api/v1`,
            description: 'Development server',
        },
        {
            url: 'https://api.electronics-store.com/v1',
            description: 'Production server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string' },
                    error: {
                        type: 'object',
                        properties: {
                            code: { type: 'string' },
                            message: { type: 'string' },
                        },
                    },
                },
            },
            Pagination: {
                type: 'object',
                properties: {
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 10 },
                    total: { type: 'integer', example: 100 },
                    totalPages: { type: 'integer', example: 10 },
                },
            },
        },
        responses: {
            UnauthorizedError: {
                description: 'Access token is missing or invalid',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' },
                    },
                },
            },
            NotFoundError: {
                description: 'Resource not found',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' },
                    },
                },
            },
            ValidationError: {
                description: 'Validation error',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' },
                    },
                },
            },
        },
    },
    security: [{ bearerAuth: [] }],
    tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Users', description: 'User management endpoints' },
        { name: 'Products', description: 'Product management endpoints' },
        { name: 'Categories', description: 'Category management endpoints' },
        { name: 'Cart', description: 'Shopping cart endpoints' },
        { name: 'Orders', description: 'Order management endpoints' },
        { name: 'Reviews', description: 'Review management endpoints' },
        { name: 'Wishlist', description: 'Wishlist endpoints' },
        { name: 'Coupons', description: 'Coupon management endpoints' },
        { name: 'Admin', description: 'Admin-only endpoints' },
    ],
};

const options: swaggerJSDoc.Options = {
    definition: swaggerDefinition,
    apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
