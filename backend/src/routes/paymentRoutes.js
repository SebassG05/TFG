import express from 'express';
import { handlePayment } from '../controllers/paymentController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

/**
 * @swagger
 * /payments/create:
 *   post:
 *     summary: Create a payment intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to charge (in dollars)
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/create', isAuthenticated, handlePayment);

export default router;