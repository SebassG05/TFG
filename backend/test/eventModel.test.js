import mongoose from 'mongoose';
import Event from '../src/models/eventModel.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Event Model Test', () => {
    jest.setTimeout(60000); // Aumentar el tiempo de espera a 60 segundos

    beforeAll(async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    });

    afterAll(async () => {
        try {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
        }
    });

    it('create & save event successfully', async () => {
        const validEvent = new Event({
            name: 'Torneo de Baloncesto',
            description: 'Un torneo emocionante',
            location: 'exterior',
            hasStands: true,
            registrationDates: {
                start: new Date(),
                end: new Date()
            },
            eventDate: new Date()
        });
        const savedEvent = await validEvent.save();

        expect(savedEvent._id).toBeDefined();
        expect(savedEvent.name).toBe('Torneo de Baloncesto');
        expect(savedEvent.description).toBe('Un torneo emocionante');
    });

    it('create event without required field should fail', async () => {
        const eventWithoutRequiredField = new Event({ description: 'Evento sin nombre' });
        let err;
        try {
            await eventWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.name).toBeDefined();
    });
});
