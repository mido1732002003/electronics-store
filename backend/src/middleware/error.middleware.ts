import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { config } from '../config';
import { logger } from '../config/logger';

export const errorHandler = (
    err: Error | ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let code = 'INTERNAL_ERROR';
    let details: Record<string, unknown> | undefined;

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        code = err.code;
        details = err.details;
    } else if (err.name === 'ValidationError') {
        // Mongoose validation error
        statusCode = 400;
        message = err.message;
        code = 'VALIDATION_ERROR';
    } else if (err.name === 'CastError') {
        // Mongoose cast error
        statusCode = 400;
        message = 'Invalid ID format';
        code = 'INVALID_ID';
    } else if (err.name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
        // Duplicate key error
        statusCode = 409;
        message = 'Duplicate field value';
        code = 'DUPLICATE_ERROR';
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
        code = 'INVALID_TOKEN';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
        code = 'TOKEN_EXPIRED';
    }

    // Log error
    if (statusCode >= 500) {
        logger.error(`${code}: ${message}`, {
            stack: err.stack,
            statusCode,
        });
    } else {
        logger.warn(`${code}: ${message}`, { statusCode });
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: {
            code,
            message,
            ...(details && { details }),
            ...(config.env === 'development' && { stack: err.stack }),
        },
    });
};

export default errorHandler;
