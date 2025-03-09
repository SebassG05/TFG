import express from 'express';
import { addToCart, removeFromCart } from '../controllers/cartController.js';
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

router.delete('/remove/:productId', isAuthenticated, removeFromCart);

export default router;