import express from 'express';
import User from '../models/userModel.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

// Obtener todos los usuarios registrados (solo admin)
router.get('/usuarios', isAdmin, async (req, res) => {
  try {
    const usuarios = await User.find({}, '-password');
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar usuario por ID (solo admin)
router.delete('/usuarios/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
