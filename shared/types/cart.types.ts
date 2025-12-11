import { IProduct } from './product.types';

export interface ICart {
    id: string;
    userId?: string;
    sessionId?: string;
    items: ICartItem[];
    subtotal: number;
    itemCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICartItem {
    id: string;
    product: Pick<IProduct, 'id' | 'name' | 'slug' | 'price' | 'compareAtPrice' | 'images' | 'quantity' | 'sku'>;
    quantity: number;
    price: number;
    total: number;
}

export interface ICartAddItem {
    productId: string;
    quantity: number;
}

export interface ICartUpdateItem {
    itemId: string;
    quantity: number;
}

export interface ICartSummary {
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
    itemCount: number;
    couponCode?: string;
    couponDiscount?: number;
}
