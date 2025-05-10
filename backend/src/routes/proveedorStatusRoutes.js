import express from 'express';
import Proveedor from '../models/proveedorModel.js';

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
