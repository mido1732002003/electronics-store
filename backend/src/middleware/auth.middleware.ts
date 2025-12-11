import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/generateToken';
import { ApiError } from '../utils/ApiError';
import { User, IUserDocument } from '../models';
import { Token } from '../models/Token.model';

declare global {
    namespace Express {
        interface Request {
            user?: IUserDocument;
            token?: string;
        }
    }
}

export const authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('Access token is required');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw ApiError.unauthorized('Access token is required');
        }

        // Verify token
        let decoded: TokenPayload;
        try {
            decoded = verifyToken(token);
        } catch {
            throw ApiError.unauthorized('Invalid or expired access token');
        }

        // Check if token type is access
        if (decoded.type !== 'access') {
            throw ApiError.unauthorized('Invalid token type');
        }

        // Check if token is blacklisted
        const blacklistedToken = await Token.findOne({
            token,
            blacklisted: true,
        });

        if (blacklistedToken) {
            throw ApiError.unauthorized('Token has been revoked');
        }

        // Get user
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw ApiError.unauthorized('User not found');
        }

        if (!user.isActive) {
            throw ApiError.unauthorized('Account has been deactivated');
        }

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        next(error);
    }
};

export const optionalAuth = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return next();
        }

        try {
            const decoded = verifyToken(token);

            if (decoded.type === 'access') {
                const user = await User.findById(decoded.userId);

                if (user && user.isActive) {
                    req.user = user;
                    req.token = token;
                }
            }
        } catch {
            // Token is invalid, continue without user
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default { authenticate, optionalAuth };
