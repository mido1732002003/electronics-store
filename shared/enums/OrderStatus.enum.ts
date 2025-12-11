export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
    RETURNED = 'returned',
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Pending',
    [OrderStatus.CONFIRMED]: 'Confirmed',
    [OrderStatus.PROCESSING]: 'Processing',
    [OrderStatus.SHIPPED]: 'Shipped',
    [OrderStatus.OUT_FOR_DELIVERY]: 'Out for Delivery',
    [OrderStatus.DELIVERED]: 'Delivered',
    [OrderStatus.CANCELLED]: 'Cancelled',
    [OrderStatus.REFUNDED]: 'Refunded',
    [OrderStatus.RETURNED]: 'Returned',
};

export const OrderStatusColor: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: '#FFA500',
    [OrderStatus.CONFIRMED]: '#4CAF50',
    [OrderStatus.PROCESSING]: '#2196F3',
    [OrderStatus.SHIPPED]: '#9C27B0',
    [OrderStatus.OUT_FOR_DELIVERY]: '#FF9800',
    [OrderStatus.DELIVERED]: '#4CAF50',
    [OrderStatus.CANCELLED]: '#F44336',
    [OrderStatus.REFUNDED]: '#607D8B',
    [OrderStatus.RETURNED]: '#795548',
};
