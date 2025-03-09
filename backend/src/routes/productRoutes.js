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

/**
 * @swagger
 * /products/update/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update
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
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid input
 */
router.put('/update/:id', isProveedor, validateSchema(updateProductSchema), updateProduct);

/**
 * @swagger
 * /products/delete/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/delete/:id', isProveedor, deleteProduct);

router.get('/search', searchProducts);
router.post('/vote', validateSchema(voteProductSchema), voteProduct);
router.get('/top', getTopProducts);

export default router;
