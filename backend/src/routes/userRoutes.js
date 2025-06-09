import express from 'express';
import { addHoopCoins } from '../controllers/userController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

/**
 * @swagger
 * /user/hoopcoins:
 *   post:
 *     summary: Otorga HoopCoins al usuario autenticado
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: HoopCoins otorgados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "HoopCoins otorgados correctamente"
 *       401:
 *         description: No autorizado
 */

// POST /api/user/hoopcoins - Otorga HoopCoins al usuario autenticado
router.post('/hoopcoins', isAuthenticated, addHoopCoins);

export default router;
