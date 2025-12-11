export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
    CANCELLED = 'cancelled',
}

export const PaymentStatusLabel: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'Pending',
    [PaymentStatus.PROCESSING]: 'Processing',
    [PaymentStatus.COMPLETED]: 'Completed',
    [PaymentStatus.FAILED]: 'Failed',
    [PaymentStatus.REFUNDED]: 'Refunded',
    [PaymentStatus.PARTIALLY_REFUNDED]: 'Partially Refunded',
    [PaymentStatus.CANCELLED]: 'Cancelled',
};

export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    PAYPAL = 'paypal',
    STRIPE = 'stripe',
    CASH_ON_DELIVERY = 'cash_on_delivery',
    BANK_TRANSFER = 'bank_transfer',
}

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
    [PaymentMethod.CREDIT_CARD]: 'Credit Card',
    [PaymentMethod.DEBIT_CARD]: 'Debit Card',
    [PaymentMethod.PAYPAL]: 'PayPal',
    [PaymentMethod.STRIPE]: 'Stripe',
    [PaymentMethod.CASH_ON_DELIVERY]: 'Cash on Delivery',
    [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
};
