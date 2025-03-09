import express from 'express';
import { createProduct, updateProduct, deleteProduct, searchProducts, voteProduct, getTopProducts } from '../controllers/productController.js';
import validateSchema from '../middlewares/validateSchema.js';
import isProveedor from '../middlewares/isProveedor.js';
import createProductSchema from '../schemas/createProductSchema.js';
import updateProductSchema from '../schemas/updateProductSchema.js';
import voteProductSchema from '../schemas/voteProductSchema.js';

const router = express.Router();

/**
 * @swagger
 * /products/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *               brand:
 *                 type: string
 *                 description: The brand of the product
 *               size:
 *                 type: number
 *                 description: The size of the product
 *               color:
 *                 type: string
 *                 description: The color of the product
 *               price:
 *                 type: number
 *                 description: The price of the product
 *               stock:
 *                 type: number
 *                 description: The stock of the product
 *               category:
 *                 type: string
 *                 description: The category of the product
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/create', isProveedor, validateSchema(createProductSchema), createProduct);

router.put('/update/:id', isProveedor, validateSchema(updateProductSchema), updateProduct);
router.delete('/delete/:id', isProveedor, deleteProduct);
router.get('/search', searchProducts);
router.post('/vote', validateSchema(voteProductSchema), voteProduct);
router.get('/top', getTopProducts);

export default router;
