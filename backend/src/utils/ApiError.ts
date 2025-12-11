export class ApiError extends Error {
    public statusCode: number;
    public code: string;
    public isOperational: boolean;
    public details?: Record<string, unknown>;

    constructor(
        statusCode: number,
        message: string,
        code: string = 'ERROR',
        isOperational: boolean = true,
        details?: Record<string, unknown>
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: string = 'Bad Request', details?: Record<string, unknown>): ApiError {
        return new ApiError(400, message, 'BAD_REQUEST', true, details);
    }

    static unauthorized(message: string = 'Unauthorized'): ApiError {
        return new ApiError(401, message, 'UNAUTHORIZED');
    }

    static forbidden(message: string = 'Forbidden'): ApiError {
        return new ApiError(403, message, 'FORBIDDEN');
    }

    static notFound(message: string = 'Not Found'): ApiError {
        return new ApiError(404, message, 'NOT_FOUND');
    }

    static conflict(message: string = 'Conflict'): ApiError {
        return new ApiError(409, message, 'CONFLICT');
    }

    static validationError(message: string = 'Validation Error', details?: Record<string, unknown>): ApiError {
        return new ApiError(422, message, 'VALIDATION_ERROR', true, details);
    }

    static tooManyRequests(message: string = 'Too Many Requests'): ApiError {
        return new ApiError(429, message, 'TOO_MANY_REQUESTS');
    }

    static internal(message: string = 'Internal Server Error'): ApiError {
        return new ApiError(500, message, 'INTERNAL_ERROR', false);
    }
}

export default ApiError;
