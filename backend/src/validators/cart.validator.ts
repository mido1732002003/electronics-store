import { z } from 'zod';

export const addToCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99),
});

export const updateCartItemSchema = z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99),
});

export const applyCouponSchema = z.object({
    couponCode: z.string().min(1, 'Coupon code is required'),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
