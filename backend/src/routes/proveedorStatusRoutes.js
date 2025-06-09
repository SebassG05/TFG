import express from 'express';
import Proveedor from '../models/proveedorModel.js';

/**
 * @swagger
 * /auth/proveedor-status/{id}:
 *   get:
 *     summary: Obtener el estado de un proveedor por ID
 *     tags: [Proveedor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proveedor
 *     responses:
 *       200:
 *         description: Estado del proveedor obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *       404:
 *         description: Proveedor no encontrado
 */

const router = express.Router();

// GET /api/auth/proveedor-status/:id
router.get('/proveedor-status/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) return res.status(404).json({ message: 'Proveedor not found' });
    res.json({ status: proveedor.status });
  } catch (e) {
    res.status(500).json({ message: 'Error fetching status' });
  }
});

export default router;
