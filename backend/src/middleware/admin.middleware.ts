import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../enums';

export const requireAdmin = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        return next(ApiError.unauthorized('Authentication required'));
    }

    if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPER_ADMIN) {
        return next(ApiError.forbidden('Admin access required'));
    }

    next();
};

export const requireSuperAdmin = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        return next(ApiError.unauthorized('Authentication required'));
    }

    if (req.user.role !== UserRole.SUPER_ADMIN) {
        return next(ApiError.forbidden('Super admin access required'));
    }

    next();
};

export const requireRoles = (...roles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(ApiError.unauthorized('Authentication required'));
        }

        if (!roles.includes(req.user.role as UserRole)) {
            return next(ApiError.forbidden('Insufficient permissions'));
        }

        next();
    };
};

export default { requireAdmin, requireSuperAdmin, requireRoles };
