import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount, currency = 'usd') => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // El monto debe estar en centavos (ejemplo: $10.00 = 1000)
            currency,
        });
        return paymentIntent;
    } catch (error) {
        throw new Error(error.message);
    }
};