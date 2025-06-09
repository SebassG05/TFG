import express from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/uploadImage.js';
import { createSorteo, authorizeSorteo, inscribirUsuario, getSorteoParticipants, getMySorteos, updateSorteo, deleteSorteo, getAllSorteos, getAllSorteosPublic } from '../controllers/sorteosController.js';

const router = express.Router();

/**
 * @swagger
 * /sorteos/:
 *   post:
 *     summary: Crear un nuevo sorteo
 *     tags: [Sorteos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Sorteo creado correctamente
 *       401:
 *         description: No autorizado
 *
 * /sorteos/{id}/authorize:
 *   patch:
 *     summary: Autorizar un sorteo
 *     tags: [Sorteos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sorteo
 *     responses:
 *       200:
 *         description: Sorteo autorizado correctamente
 *       401:
 *         description: No autorizado
 *
 * /sorteos/{id}/inscribirse:
 *   post:
 *     summary: Inscribir usuario en sorteo
 *     tags: [Sorteos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sorteo
 *     responses:
 *       200:
 *         description: Usuario inscrito correctamente
 *       401:
 *         description: No autorizado
 *
 * /sorteos/{id}/participants:
 *   get:
 *     summary: Obtener participantes de un sorteo
 *     tags: [Sorteos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sorteo
 *     responses:
 *       200:
 *         description: Participantes obtenidos correctamente
 *       401:
 *         description: No autorizado
 *
 * /sorteos/mis-sorteos:
 *   get:
 *     summary: Obtener mis sorteos
 *     tags: [Sorteos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sorteos del usuario
 *       401:
 *         description: No autorizado
 *
 * /sorteos/all:
 *   get:
 *     summary: Obtener todos los sorteos (privado)
 *     tags: [Sorteos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sorteos obtenida correctamente
 *       401:
 *         description: No autorizado
 *
 * /sorteos/public/all:
 *   get:
 *     summary: Obtener todos los sorteos públicos
 *     tags: [Sorteos]
 *     responses:
 *       200:
 *         description: Lista de sorteos públicos obtenida correctamente
 */

// Aplica el middleware de autenticación y de subida de imagen solo a las rutas que lo necesiten
router.post('/', auth, upload.single('image'), createSorteo);
router.patch('/:id/authorize', auth, authorizeSorteo);
router.post('/approve/:id', auth, authorizeSorteo);
router.post('/:id/inscribirse', auth, inscribirUsuario);
router.get('/:id/participants', auth, getSorteoParticipants);
router.get('/mis-sorteos', auth, getMySorteos);
router.put('/:id', auth, updateSorteo);
router.delete('/:id', auth, deleteSorteo);
router.get('/all', auth, getAllSorteos);
router.get('/public/all', getAllSorteosPublic);

export default router;
