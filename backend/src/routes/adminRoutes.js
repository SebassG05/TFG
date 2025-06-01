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

// Obtener inscripciones a eventos (admin)
router.get('/inscripciones/eventos', isAdmin, async (req, res) => {
  try {
    // Buscar todos los usuarios con eventos inscritos y poblar los eventos
    const usuarios = await User.find({ registeredEvents: { $exists: true, $not: { $size: 0 } } })
      .populate('registeredEvents', 'name');
    // Formato: [{ usuario, evento }]
    const resultado = [];
    usuarios.forEach(u => {
      u.registeredEvents.forEach(ev => {
        resultado.push({ usuario: u.username, email: u.email, evento: ev.name, eventoId: ev._id });
      });
    });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener inscripciones a sorteos (admin)
router.get('/inscripciones/sorteos', isAdmin, async (req, res) => {
  try {
    const usuarios = await User.find({ registeredRaffles: { $exists: true, $not: { $size: 0 } } })
      .populate('registeredRaffles', 'title');
    const resultado = [];
    usuarios.forEach(u => {
      u.registeredRaffles.forEach(s => {
        resultado.push({ usuario: u.username, email: u.email, sorteo: s.title, sorteoId: s._id });
      });
    });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
