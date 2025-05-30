import { createPaymentIntent } from '../services/paymentService.js';
import Stripe from 'stripe';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import Cart from '../models/cartModel.js';
import Order from '../models/orderModel.js';
import { calculateHoopCoins } from '../utils/hoopCoins.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handlePayment = async (req, res) => {
    const userId = req.user._id;
    try {
        // Obtener el carrito del usuario
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || !cart.items.length) {
            return res.status(400).json({ message: 'El carrito está vacío.' });
        }

        // Construir los line_items para Stripe
        const line_items = cart.items.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.productId.name,
                },
                unit_amount: Math.round(item.productId.price * 100),
            },
            quantity: item.quantity,
        }));

        // Crea la sesión de Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            customer_email: req.user.email,
        });

        // Crear la orden en la base de datos
        const order = new Order({
            userId,
            products: cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            })),
            totalPrice: cart.totalPrice,
            status: 'pagado',
            createdAt: new Date()
        });
        await order.save();

        // Añadir la orden al historial de compras del usuario
        await User.findByIdAndUpdate(userId, { $push: { purchaseHistory: order._id } });

        res.status(200).json({
            sessionId: session.id,
            sessionUrl: session.url,
            total: cart.totalPrice,
            hoopCoinsEarned: calculateHoopCoins(cart.totalPrice)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};