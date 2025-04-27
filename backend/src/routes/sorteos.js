import express from 'express';
import auth from '../middlewares/auth.js';
import { createSorteo, authorizeSorteo, inscribirUsuario } from '../controllers/sorteosController.js';

const router = express.Router();

// Aplica el middleware de autenticación solo a las rutas que lo necesiten
router.post('/', auth, createSorteo);
router.patch('/:id/authorize', auth, authorizeSorteo);
router.post('/approve/:id', auth, authorizeSorteo);
router.post('/:id/inscribirse', auth, inscribirUsuario);

export default router;
