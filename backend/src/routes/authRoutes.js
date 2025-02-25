import express from 'express';
import { register, login, approveProveedor, rejectProveedor } from '../controllers/authController.js';
import validateSchema from '../middlewares/validateSchema.js';
import isAdmin from '../middlewares/isAdmin.js';
import registerSchema from '../schemas/registerSchema.js';
import loginSchema from '../schemas/loginSchema.js';

const router = express.Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.post('/approve-proveedor', isAdmin, approveProveedor);
router.post('/reject-proveedor', isAdmin, rejectProveedor);

export default router;
