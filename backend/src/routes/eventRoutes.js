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

/**
 * @swagger
 * /events/register/{eventId}:
 *   post:
 *     summary: Register for an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to register for
 *     responses:
 *       200:
 *         description: Successfully registered for the event
 *       400:
 *         description: Registration is not open for this event
 *       404:
 *         description: Event not found
 */
router.post('/register/:eventId', isAuthenticated, registerForEvent);

/**
 * @swagger
 * /events/update/{eventId}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to update
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
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 */
router.put('/update/:eventId', isAdmin, updateEvent);

/**
 * @swagger
 * /events/delete/{eventId}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete('/delete/:eventId', isAdmin, deleteEvent); // Asegúrate de que esta línea esté presente

export default router;