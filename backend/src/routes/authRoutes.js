import express from 'express';
import { register, login } from '../controllers/authController.js';
import validateSchema from '../middlewares/validateSchema.js';
import registerSchema from '../schemas/registerSchema.js';

const router = express.Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', login);

export default router;
