import { createPaymentIntent } from '../services/paymentService.js';
import Stripe from 'stripe';
import Product from '../models/productModel.js'; // Asegúrate de que este modelo exista

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handlePayment = async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
        // Busca el producto en la base de datos
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!product.price || product.price <= 0) {
            return res.status(400).json({ message: 'Invalid product price' });
        }

        // Crea el PaymentIntent con el precio del producto
        const paymentIntent = await createPaymentIntent(Math.round(product.price * 100));

        // Crea una sesión de Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: Math.round(product.price * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            sessionId: session.id,
            sessionUrl: session.url,
            product: {
                id: product._id,
                name: product.name,
                price: product.price,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};