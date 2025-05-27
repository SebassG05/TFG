import express from 'express';
import { recomendarZapatilla } from '../controllers/iaController.js';

const router = express.Router();

// Ruta para recomendación de zapatilla ideal
router.post('/recomendar-zapatilla', recomendarZapatilla);

export default router;
