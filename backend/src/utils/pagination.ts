import { config } from '../config';

export interface PaginationParams {
    page?: number | string;
    limit?: number | string;
}

export interface PaginationResult {
    page: number;
    limit: number;
    skip: number;
}

export const getPagination = (params: PaginationParams): PaginationResult => {
    const page = Math.max(1, parseInt(String(params.page || config.pagination.defaultPage), 10));
    const limit = Math.min(
        config.pagination.maxLimit,
        Math.max(1, parseInt(String(params.limit || config.pagination.defaultLimit), 10))
    );
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export const getPaginationMeta = (total: number, page: number, limit: number): PaginationMeta => {
    const totalPages = Math.ceil(total / limit);

    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};

export default { getPagination, getPaginationMeta };
