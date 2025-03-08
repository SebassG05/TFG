import express from 'express';
import { register, login, logout, approveProveedor, rejectProveedor, getProfile, forgotPassword, resetPassword } from '../controllers/authController.js';
import validateSchema from '../middlewares/validateSchema.js';
import isAdmin from '../middlewares/isAdmin.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import registerSchema from '../schemas/registerSchema.js';
import loginSchema from '../schemas/loginSchema.js';

const router = express.Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.post('/logout', logout); // Asegúrate de que esta línea esté presente
router.post('/approve-proveedor', isAdmin, approveProveedor);
router.post('/reject-proveedor', isAdmin, rejectProveedor);
router.get('/profile', isAuthenticated, getProfile); // Nueva ruta para obtener el perfil del usuario
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;