import { Request, Response, NextFunction } from 'express';
import { Schema, ValidationError } from 'joi';
import { z, ZodError, ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

type ValidationSource = 'body' | 'query' | 'params';

// Joi validation middleware
export const validateJoi = (
    schema: Schema,
    source: ValidationSource = 'body'
) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const { error, value } = schema.validate(req[source], {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const details = error.details.reduce(
                (acc: Record<string, string>, detail) => {
                    acc[detail.path.join('.')] = detail.message;
                    return acc;
                },
                {}
            );

            return next(
                ApiError.validationError('Validation failed', details)
            );
        }

        req[source] = value;
        next();
    };
};

// Zod validation middleware
export const validateZod = <T>(
    schema: ZodSchema<T>,
    source: ValidationSource = 'body'
) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            const result = schema.parse(req[source]);
            req[source] = result as typeof req[typeof source];
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const details = error.errors.reduce(
                    (acc: Record<string, string>, err) => {
                        acc[err.path.join('.')] = err.message;
                        return acc;
                    },
                    {}
                );

                return next(
                    ApiError.validationError('Validation failed', details)
                );
            }
            next(error);
        }
    };
};

// Generic validation middleware
export const validate = validateZod;

export default { validateJoi, validateZod, validate };
