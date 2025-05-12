import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import cartRoutes from './cartRoutes.js';
import eventRoutes from './eventRoutes.js';
import paymentRoutes from './paymentRoutes.js'; 
import proveedorStatusRoutes from './proveedorStatusRoutes.js';
import adminRoutes from './adminRoutes.js';
import sorteosRoutes from './sorteos.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/auth', proveedorStatusRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/events', eventRoutes); // Asegúrate de que esta línea esté presente
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/sorteos', sorteosRoutes);

export default router;