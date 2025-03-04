import express from 'express';
import { createEvent, registerForEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import isAdmin from '../middlewares/isAdmin.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.post('/create', isAdmin, createEvent);
router.post('/register/:eventId', isAuthenticated, registerForEvent);
router.put('/update/:eventId', isAdmin, updateEvent);
router.delete('/delete/:eventId', isAdmin, deleteEvent); // Asegúrate de que esta línea esté presente

export default router;