export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
    CANCELLED = 'cancelled',
}

export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    PAYPAL = 'paypal',
    STRIPE = 'stripe',
    CASH_ON_DELIVERY = 'cash_on_delivery',
    BANK_TRANSFER = 'bank_transfer',
}
