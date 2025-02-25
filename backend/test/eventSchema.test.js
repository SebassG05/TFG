import { z } from 'zod';
import eventSchema from '../src/schemas/eventSchema.js';

describe('Event Schema Test', () => {
    it('should validate a valid event', () => {
        const validEvent = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Torneo de Baloncesto',
            description: 'Un torneo emocionante',
            location: 'exterior',
            hasStands: true,
            registrationDates: {
                start: new Date(),
                end: new Date()
            },
            eventDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        expect(() => eventSchema.parse(validEvent)).not.toThrow();
    });

    it('should fail validation for an invalid event', () => {
        const invalidEvent = {
            description: 'Evento sin nombre'
        };
        expect(() => eventSchema.parse(invalidEvent)).toThrow();
    });
});
