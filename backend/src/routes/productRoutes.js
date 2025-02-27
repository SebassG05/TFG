import express from 'express';
import { createProduct } from '../controllers/productController.js';
import validateSchema from '../middlewares/validateSchema.js';
import isProveedor from '../middlewares/isProveedor.js';
import createProductSchema from '../schemas/createProductSchema.js';

const router = express.Router();

router.post('/create', isProveedor, validateSchema(createProductSchema), createProduct);

export default router;
