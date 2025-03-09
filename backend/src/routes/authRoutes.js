import express from 'express';
import { register, login, logout, approveProveedor, rejectProveedor, getProfile, forgotPassword, resetPassword } from '../controllers/authController.js';
import validateSchema from '../middlewares/validateSchema.js';
import isAdmin from '../middlewares/isAdmin.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import registerSchema from '../schemas/registerSchema.js';
import loginSchema from '../schemas/loginSchema.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', validateSchema(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 */
router.post('/login', validateSchema(loginSchema), login);

router.post('/logout', logout); // Asegúrate de que esta línea esté presente
router.post('/approve-proveedor', isAdmin, approveProveedor);
router.post('/reject-proveedor', isAdmin, rejectProveedor);
router.get('/profile', isAuthenticated, getProfile); // Nueva ruta para obtener el perfil del usuario
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;