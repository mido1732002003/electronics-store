export const calculateSubtotal = (items: Array<{ price: number; quantity: number }>): number => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calculateTax = (subtotal: number, taxRate: number = 0.08): number => {
    return Math.round(subtotal * taxRate * 100) / 100;
};

export const calculateShipping = (
    subtotal: number,
    itemCount: number,
    freeShippingThreshold: number = 100
): number => {
    if (subtotal >= freeShippingThreshold) {
        return 0;
    }

    // Base shipping + per item fee
    const baseShipping = 5.99;
    const perItemFee = 0.99;

    return Math.round((baseShipping + (itemCount - 1) * perItemFee) * 100) / 100;
};

export const calculateDiscount = (
    subtotal: number,
    discountType: 'percentage' | 'fixed',
    discountValue: number,
    maximumDiscount?: number
): number => {
    let discount: number;

    if (discountType === 'percentage') {
        discount = Math.round((subtotal * discountValue / 100) * 100) / 100;
    } else {
        discount = discountValue;
    }

    if (maximumDiscount && discount > maximumDiscount) {
        discount = maximumDiscount;
    }

    return Math.min(discount, subtotal); // Discount cannot exceed subtotal
};

export const calculateTotal = (
    subtotal: number,
    shipping: number,
    tax: number,
    discount: number
): number => {
    return Math.round((subtotal + shipping + tax - discount) * 100) / 100;
};

export const roundToTwoDecimals = (value: number): number => {
    return Math.round(value * 100) / 100;
};

export const formatPrice = (price: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(price);
};

export default {
    calculateSubtotal,
    calculateTax,
    calculateShipping,
    calculateDiscount,
    calculateTotal,
    roundToTwoDecimals,
    formatPrice,
};
