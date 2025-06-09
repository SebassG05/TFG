import express from 'express';
import { crearSugerencia, obtenerSugerencias, actualizarEstadoSugerencia } from '../controllers/sugerenciaController.js';
import isAdmin from '../middlewares/isAdmin.js';
import validateSchema from '../middlewares/validateSchema.js';
import { sugerenciaSchema } from '../schemas/sugerenciaSchema.js';

const router = express.Router();

/**
 * @swagger
 * /sugerencias:
 *   post:
 *     summary: Crear una sugerencia
 *     tags: [Sugerencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Sugerencia creada correctamente
 *   get:
 *     summary: Obtener todas las sugerencias (solo admin)
 *     tags: [Sugerencias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sugerencias obtenida correctamente
 *       401:
 *         description: No autorizado
 *
 * /sugerencias/{id}/estado:
 *   patch:
 *     summary: Actualizar estado de sugerencia (solo admin)
 *     tags: [Sugerencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sugerencia
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       401:
 *         description: No autorizado
 */

// Ruta para crear sugerencia (público)
router.post('/', validateSchema(sugerenciaSchema), crearSugerencia);

// Ruta para obtener todas las sugerencias (solo admin)
router.get('/', isAdmin, obtenerSugerencias);

// Ruta para actualizar estado (solo admin)
router.patch('/:id/estado', isAdmin, actualizarEstadoSugerencia);

export default router;
