import express from 'express';
import { crearSugerencia, obtenerSugerencias, actualizarEstadoSugerencia } from '../controllers/sugerenciaController.js';
import isAdmin from '../middlewares/isAdmin.js';
import validateSchema from '../middlewares/validateSchema.js';
import { sugerenciaSchema } from '../schemas/sugerenciaSchema.js';

const router = express.Router();

// Ruta para crear sugerencia (público)
router.post('/', validateSchema(sugerenciaSchema), crearSugerencia);

// Ruta para obtener todas las sugerencias (solo admin)
router.get('/', isAdmin, obtenerSugerencias);

// Ruta para actualizar estado (solo admin)
router.patch('/:id/estado', isAdmin, actualizarEstadoSugerencia);

export default router;
