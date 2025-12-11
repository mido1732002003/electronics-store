export interface IProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    sku: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    quantity: number;
    lowStockThreshold: number;
    images: IProductImage[];
    category: IProductCategory;
    subcategory?: IProductCategory;
    brand?: IProductBrand;
    specifications: IProductSpecification[];
    features: string[];
    tags: string[];
    weight?: number;
    dimensions?: IProductDimensions;
    isActive: boolean;
    isFeatured: boolean;
    isNewArrival: boolean;
    averageRating: number;
    reviewCount: number;
    soldCount: number;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductImage {
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
}

export interface IProductCategory {
    id: string;
    name: string;
    slug: string;
}

export interface IProductBrand {
    id: string;
    name: string;
    slug: string;
    logo?: string;
}

export interface IProductSpecification {
    name: string;
    value: string;
    group?: string;
}

export interface IProductDimensions {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
}

export interface IProductFilter {
    category?: string;
    subcategory?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    inStock?: boolean;
    search?: string;
    sortBy?: 'price' | 'rating' | 'newest' | 'popular' | 'name';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface IProductCreate {
    name: string;
    description: string;
    shortDescription: string;
    sku: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    quantity: number;
    lowStockThreshold?: number;
    categoryId: string;
    subcategoryId?: string;
    brandId?: string;
    specifications?: IProductSpecification[];
    features?: string[];
    tags?: string[];
    weight?: number;
    dimensions?: IProductDimensions;
    isActive?: boolean;
    isFeatured?: boolean;
    isNewArrival?: boolean;
}

export interface IProductUpdate extends Partial<IProductCreate> { }

export interface IProductListResponse {
    products: IProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
