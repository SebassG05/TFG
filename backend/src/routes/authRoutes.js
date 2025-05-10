import express from 'express';
import { register, login, logout, approveProveedor, rejectProveedor, getProfile, forgotPassword, resetPassword, getProveedoresPendientes } from '../controllers/authController.js';
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

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', logout); // Asegúrate de que esta línea esté presente

/**
 * @swagger
 * /auth/approve-proveedor:
 *   post:
 *     summary: Approve a proveedor
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proveedorId:
 *                 type: string
 *                 description: The ID of the proveedor to approve
 *     responses:
 *       200:
 *         description: Proveedor approved successfully
 *       404:
 *         description: Proveedor not found
 */
router.post('/approve-proveedor', isAdmin, approveProveedor);

/**
 * @swagger
 * /auth/reject-proveedor:
 *   post:
 *     summary: Reject a proveedor
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proveedorId:
 *                 type: string
 *                 description: The ID of the proveedor to reject
 *     responses:
 *       200:
 *         description: Proveedor rejected successfully
 *       404:
 *         description: Proveedor not found
 */
router.post('/reject-proveedor', isAdmin, rejectProveedor);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/profile', isAuthenticated, getProfile); // Nueva ruta para obtener el perfil del usuario

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm the new password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or passwords do not match
 */
router.post('/reset-password/:token', resetPassword);

/**
 * @swagger
 * /auth/proveedores-pendientes:
 *   get:
 *     summary: Get pending proveedores
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending proveedores retrieved successfully
 *       404:
 *         description: No pending proveedores found
 */
router.get('/proveedores-pendientes', isAdmin, getProveedoresPendientes);

export default router;