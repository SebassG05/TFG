import express from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/uploadImage.js';
import { createSorteo, authorizeSorteo, inscribirUsuario, getSorteoParticipants, getMySorteos, updateSorteo } from '../controllers/sorteosController.js';

const router = express.Router();

// Aplica el middleware de autenticación y de subida de imagen solo a las rutas que lo necesiten
router.post('/', auth, upload.single('image'), createSorteo);
router.patch('/:id/authorize', auth, authorizeSorteo);
router.post('/approve/:id', auth, authorizeSorteo);
router.post('/:id/inscribirse', auth, inscribirUsuario);
router.get('/:id/participants', auth, getSorteoParticipants);
router.get('/mis-sorteos', auth, getMySorteos);
router.put('/:id', auth, updateSorteo);

export default router;
