import Stripe from 'stripe';
import { config } from './index';

export const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2023-10-16',
    typescript: true,
});

export interface CreatePaymentIntentParams {
    amount: number; // in cents
    currency?: string;
    customerId?: string;
    metadata?: Record<string, string>;
}

export const createPaymentIntent = async ({
    amount,
    currency = 'usd',
    customerId,
    metadata = {},
}: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent> => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            customer: customerId,
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return paymentIntent;
    } catch (error) {
        console.error('Stripe create payment intent error:', error);
        throw error;
    }
};

export const confirmPaymentIntent = async (
    paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
        return paymentIntent;
    } catch (error) {
        console.error('Stripe confirm payment intent error:', error);
        throw error;
    }
};

export const createRefund = async (
    paymentIntentId: string,
    amount?: number // in cents, optional for partial refund
): Promise<Stripe.Refund> => {
    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount,
        });
        return refund;
    } catch (error) {
        console.error('Stripe refund error:', error);
        throw error;
    }
};

export const createCustomer = async (
    email: string,
    name: string,
    metadata?: Record<string, string>
): Promise<Stripe.Customer> => {
    try {
        const customer = await stripe.customers.create({
            email,
            name,
            metadata,
        });
        return customer;
    } catch (error) {
        console.error('Stripe create customer error:', error);
        throw error;
    }
};

export const retrievePaymentIntent = async (
    paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
    try {
        return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
        console.error('Stripe retrieve payment intent error:', error);
        throw error;
    }
};

export const constructWebhookEvent = (
    payload: string | Buffer,
    signature: string
): Stripe.Event => {
    return stripe.webhooks.constructEvent(
        payload,
        signature,
        config.stripe.webhookSecret
    );
};

export default stripe;
