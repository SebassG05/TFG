import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import cartRoutes from './cartRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);

export default router;