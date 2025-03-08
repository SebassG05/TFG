import express from 'express';
import { createProduct, updateProduct, deleteProduct, searchProducts, voteProduct, getTopProducts } from '../controllers/productController.js';
import validateSchema from '../middlewares/validateSchema.js';
import isProveedor from '../middlewares/isProveedor.js';
import createProductSchema from '../schemas/createProductSchema.js';
import updateProductSchema from '../schemas/updateProductSchema.js';
import voteProductSchema from '../schemas/voteProductSchema.js';

const router = express.Router();

router.post('/create', isProveedor, validateSchema(createProductSchema), createProduct);
router.put('/update/:id', isProveedor, validateSchema(updateProductSchema), updateProduct);
router.delete('/delete/:id', isProveedor, deleteProduct);
router.get('/search', searchProducts);
router.post('/vote', validateSchema(voteProductSchema), voteProduct);
router.get('/top', getTopProducts);

export default router;
