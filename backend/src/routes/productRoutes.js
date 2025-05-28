import express from 'express';
import { createProduct, updateProduct, deleteProduct, searchProducts, voteProduct, getTopProducts, getProductosProveedor, getVotosProductos } from '../controllers/productController.js';
import validateSchema from '../middlewares/validateSchema.js';
import isProveedor from '../middlewares/isProveedor.js';
import upload from '../middlewares/uploadImage.js';
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
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 */
router.post('/create', isProveedor, upload.array('images', 4), validateSchema(createProductSchema), async (req, res, next) => {
  req.body.images = req.files ? req.files.map(f => f.path) : [];
  next();
}, createProduct);

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
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 */
router.delete('/delete/:id', deleteProduct);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search for products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the product to search for
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: The brand of the product to search for
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: The color of the product to search for
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category of the product to search for
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 */
router.get('/search', searchProducts);

/**
 * @swagger
 * /products/vote:
 *   post:
 *     summary: Vote for a product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoteProduct'
 *     responses:
 *       200:
 *         description: Vote added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vote added successfully"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 */
router.post('/vote', validateSchema(voteProductSchema), voteProduct);

/**
 * @swagger
 * /products/top:
 *   get:
 *     summary: Get top products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Top products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/top', getTopProducts);

/**
 * @swagger
 * /products/mis-productos:
 *   get:
 *     summary: Get products of the provider
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Products not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Products not found"
 */
router.get('/mis-productos', isProveedor, getProductosProveedor);

/**
 * @swagger
 * /products/votos:
 *   get:
 *     summary: Get votes for all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Votes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vote'
 */
router.get('/votos', getVotosProductos);

export default router;
