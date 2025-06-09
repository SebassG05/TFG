import express from 'express';
import User from '../models/userModel.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

/**
 * @swagger
 * /admin/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios registrados (solo admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: No autorizado
 *
 *   delete:
 *     summary: Eliminar usuario por ID (solo admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */

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

/**
 * @swagger
 * /admin/inscripciones/eventos:
 *   get:
 *     summary: Obtener inscripciones a eventos (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inscripciones a eventos obtenidas correctamente
 *       401:
 *         description: No autorizado
 */

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

/**
 * @swagger
 * /admin/inscripciones/sorteos:
 *   get:
 *     summary: Obtener inscripciones a sorteos (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inscripciones a sorteos obtenidas correctamente
 *       401:
 *         description: No autorizado
 */

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
