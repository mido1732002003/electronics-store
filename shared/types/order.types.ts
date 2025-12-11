import { OrderStatus, PaymentMethod, PaymentStatus } from '../enums';
import { IProduct } from './product.types';
import { IUser } from './user.types';

export interface IOrder {
    id: string;
    orderNumber: string;
    user: Pick<IUser, 'id' | 'email' | 'firstName' | 'lastName'>;
    items: IOrderItem[];
    shippingAddress: IOrderAddress;
    billingAddress: IOrderAddress;
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    paymentDetails?: IPaymentDetails;
    trackingNumber?: string;
    trackingUrl?: string;
    notes?: string;
    couponCode?: string;
    estimatedDelivery?: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderItem {
    id: string;
    product: Pick<IProduct, 'id' | 'name' | 'slug' | 'images' | 'sku'>;
    quantity: number;
    price: number;
    total: number;
}

export interface IOrderAddress {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
}

export interface IPaymentDetails {
    transactionId?: string;
    gateway?: string;
    last4?: string;
    brand?: string;
    receiptUrl?: string;
}

export interface IOrderCreate {
    items: { productId: string; quantity: number }[];
    shippingAddress: IOrderAddress;
    billingAddress?: IOrderAddress;
    paymentMethod: PaymentMethod;
    couponCode?: string;
    notes?: string;
}

export interface IOrderUpdate {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    trackingNumber?: string;
    trackingUrl?: string;
    notes?: string;
    estimatedDelivery?: Date;
}

export interface IOrderListResponse {
    orders: IOrder[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IOrderFilter {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    startDate?: Date;
    endDate?: Date;
    search?: string;
    page?: number;
    limit?: number;
}
