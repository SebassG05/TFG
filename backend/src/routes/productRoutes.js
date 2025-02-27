import express from 'express';
import { createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import validateSchema from '../middlewares/validateSchema.js';
import isProveedor from '../middlewares/isProveedor.js';
import createProductSchema from '../schemas/createProductSchema.js';
import updateProductSchema from '../schemas/updateProductSchema.js';

const router = express.Router();

router.post('/create', isProveedor, validateSchema(createProductSchema), createProduct);
router.put('/update/:id', isProveedor, validateSchema(updateProductSchema), updateProduct);
router.delete('/delete/:id', isProveedor, deleteProduct);

export default router;
