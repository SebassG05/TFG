import express from 'express';
import { addToCart, removeFromCart, getCart, clearCart } from '../controllers/cartController.js';
import validateSchema from '../middlewares/validateSchema.js';
import addToCartSchema from '../schemas/addToCartSchema.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to add
 *               quantity:
 *                 type: number
 *                 description: The quantity of the product to add
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       404:
 *         description: Product not found
 */
router.post('/add', isAuthenticated, validateSchema(addToCartSchema), addToCart);

/**
 * @swagger
 * /cart/remove/{productId}:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to remove
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       404:
 *         description: Product not found in cart
 */
router.delete('/remove/:productId', isAuthenticated, removeFromCart);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       404:
 *         description: Cart not found
 */
router.get('/', isAuthenticated, getCart);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       404:
 *         description: Cart not found
 */
router.delete('/clear', isAuthenticated, clearCart);

export default router;