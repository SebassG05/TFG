import express from 'express';
import { createEvent, registerForEvent, updateEvent } from '../controllers/eventController.js';
import isAdmin from '../middlewares/isAdmin.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.post('/create', isAdmin, createEvent);
router.post('/register/:eventId', isAuthenticated, registerForEvent);
router.put('/update/:eventId', isAdmin, updateEvent); // Nueva ruta para actualizar eventos

export default router;