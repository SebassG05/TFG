import mongoose from 'mongoose';
import Event from '../src/models/eventModel.js';

describe('Event Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    jest.setTimeout(30000); // Aumentar el tiempo de espera a 30 segundos

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
