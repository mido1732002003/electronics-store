import { z } from 'zod';
import { PaymentMethod } from '../enums';

const addressSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    company: z.string().optional(),
    address1: z.string().min(1, 'Address is required'),
    address2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().min(1, 'Phone number is required'),
});

export const createOrderSchema = z.object({
    shippingAddress: addressSchema,
    billingAddress: addressSchema.optional(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    couponCode: z.string().optional(),
    notes: z.string().max(500).optional(),
    useSameAddress: z.boolean().default(true),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum([
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'refunded',
        'returned',
    ]),
    trackingNumber: z.string().optional(),
    trackingUrl: z.string().url().optional(),
    notes: z.string().max(500).optional(),
    estimatedDelivery: z.string().datetime().optional(),
});

export const cancelOrderSchema = z.object({
    reason: z.string().min(1, 'Cancellation reason is required').max(500),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
