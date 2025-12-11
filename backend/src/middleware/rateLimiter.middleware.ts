import rateLimit from 'express-rate-limit';
import { config } from '../config';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later',
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Rate limit exceeded',
        },
    },
    skip: () => config.env === 'development',
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later',
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Auth rate limit exceeded',
        },
    },
    skip: () => config.env === 'development',
});

// Password reset rate limiter
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 password reset requests per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many password reset attempts, please try again later',
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Password reset rate limit exceeded',
        },
    },
    skip: () => config.env === 'development',
});

// Email verification rate limiter
export const emailVerificationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 email verification requests per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many email verification requests, please try again later',
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Email verification rate limit exceeded',
        },
    },
    skip: () => config.env === 'development',
});

// Order creation rate limiter
export const orderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 orders per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many orders placed, please try again later',
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Order rate limit exceeded',
        },
    },
    skip: () => config.env === 'development',
});

export default {
    apiLimiter,
    authLimiter,
    passwordResetLimiter,
    emailVerificationLimiter,
    orderLimiter,
};
