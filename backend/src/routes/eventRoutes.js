import express from 'express';
import { createEvent, registerForEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import isAdmin from '../middlewares/isAdmin.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

/**
 * @swagger
 * /events/create:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
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
 *                 description: The name of the event
 *               description:
 *                 type: string
 *                 description: The description of the event
 *               location:
 *                 type: string
 *                 description: The location of the event
 *               hasStands:
 *                 type: boolean
 *                 description: Whether the event has stands
 *               registrationDates:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date-time
 *                     description: The start date of registration
 *                   end:
 *                     type: string
 *                     format: date-time
 *                     description: The end date of registration
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the event
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/create', isAdmin, createEvent);

router.post('/register/:eventId', isAuthenticated, registerForEvent);
router.put('/update/:eventId', isAdmin, updateEvent);
router.delete('/delete/:eventId', isAdmin, deleteEvent); // Asegúrate de que esta línea esté presente

export default router;