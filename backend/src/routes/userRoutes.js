import express from 'express';
import { addHoopCoins } from '../controllers/userController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// POST /api/user/hoopcoins - Otorga HoopCoins al usuario autenticado
router.post('/hoopcoins', isAuthenticated, addHoopCoins);

export default router;
