import { Response } from 'express';

export interface ApiResponseData<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

export class ApiResponse {
    static success<T>(
        res: Response,
        data: T,
        message: string = 'Success',
        statusCode: number = 200,
        meta?: ApiResponseData['meta']
    ): Response {
        const response: ApiResponseData<T> = {
            success: true,
            message,
            data,
        };

        if (meta) {
            response.meta = meta;
        }

        return res.status(statusCode).json(response);
    }

    static created<T>(res: Response, data: T, message: string = 'Created successfully'): Response {
        return this.success(res, data, message, 201);
    }

    static noContent(res: Response): Response {
        return res.status(204).send();
    }

    static paginated<T>(
        res: Response,
        data: T[],
        total: number,
        page: number,
        limit: number,
        message: string = 'Success'
    ): Response {
        const totalPages = Math.ceil(total / limit);

        // Set pagination headers
        res.setHeader('X-Total-Count', total.toString());
        res.setHeader('X-Page', page.toString());
        res.setHeader('X-Limit', limit.toString());
        res.setHeader('X-Total-Pages', totalPages.toString());

        return this.success(res, data, message, 200, {
            page,
            limit,
            total,
            totalPages,
        });
    }

    static error(
        res: Response,
        message: string,
        statusCode: number = 500,
        code: string = 'ERROR',
        details?: Record<string, unknown>
    ): Response {
        return res.status(statusCode).json({
            success: false,
            message,
            error: {
                code,
                message,
                details,
            },
        });
    }
}

export default ApiResponse;
