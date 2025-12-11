export interface IApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: IApiError;
    meta?: IApiMeta;
}

export interface IApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
}

export interface IApiMeta {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
}

export interface IPaginationParams {
    page?: number;
    limit?: number;
}

export interface ISortParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ISearchParams {
    search?: string;
}

export type IQueryParams = IPaginationParams & ISortParams & ISearchParams;
