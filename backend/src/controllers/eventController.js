import Event from '../models/eventModel.js';
import User from '../models/userModel.js';

export const createEvent = async (req, res) => {
    const { name, description, location, hasStands, registrationDates, eventDate } = req.body;
    let img = '';
    if (req.file && req.file.path) {
        img = req.file.path;
    } else {
        return res.status(400).json({ message: 'La imagen del evento es obligatoria.' });
    }
    try {
        const newEvent = new Event({
            name,
            description,
            location,
            hasStands,
            registrationDates,
            eventDate,
            img
        });
        newEvent.updateIsActive();
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const registerForEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user._id;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const currentDate = new Date();
        if (currentDate < event.registrationDates.start || currentDate > event.registrationDates.end) {
            return res.status(400).json({ message: 'Registration is not open for this event' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.registeredEvents.includes(eventId)) {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }

        user.registeredEvents.push(eventId);
        await user.save();

        res.status(200).json({ message: 'Successfully registered for the event' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateEvent = async (req, res) => {
    const { eventId } = req.params;
    const { name, description, location, hasStands, registrationDates, eventDate } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.name = name || event.name;
        event.description = description || event.description;
        event.location = location || event.location;
        event.hasStands = hasStands !== undefined ? hasStands : event.hasStands;
        event.registrationDates = registrationDates || event.registrationDates;
        event.eventDate = eventDate || event.eventDate;

        event.updateIsActive();

        const updatedEvent = await event.save();
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    const { eventId } = req.params;

    try {
        const deletedEvent = await Event.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};