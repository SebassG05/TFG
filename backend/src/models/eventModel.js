import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    location: { type: String, enum: ['exterior', 'interior'], required: true },
    hasStands: { type: Boolean, required: true },
    registrationDates: {
        start: { type: Date, required: true },
        end: { type: Date, required: true }
    },
    eventDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
