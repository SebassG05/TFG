import express from 'express';
import { recomendarZapatilla } from '../controllers/iaController.js';

/**
 * @swagger
 * /ia/recomendar-zapatilla:
 *   post:
 *     summary: Recomendar zapatilla ideal
 *     tags: [IA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Recomendación generada correctamente
 */

const router = express.Router();

// Ruta para recomendación de zapatilla ideal
router.post('/recomendar-zapatilla', recomendarZapatilla);

export default router;
