export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin'
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole | string;
    avatar?: string;
}

export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    countInStock?: number;
    rotation?: number;
    rating?: number;
    numReviews?: number;
    images?: string[];
}
