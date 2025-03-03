import express from 'express';
import { addToCart, removeFromCart } from '../controllers/cartController.js';
import validateSchema from '../middlewares/validateSchema.js';
import addToCartSchema from '../schemas/addToCartSchema.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.post('/add', isAuthenticated, validateSchema(addToCartSchema), addToCart);
router.delete('/remove/:productId', isAuthenticated, removeFromCart);

export default router;