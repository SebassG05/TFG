import { z } from 'zod';

const eventSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().optional(),
    location: z.enum(['exterior', 'interior']),
    //si tiene gradas o no 
    hasStands: z.boolean(),
    registrationDates: z.object({
        start: z.date(),
        end: z.date()
    }),
    eventDate: z.date(),
    createdAt: z.date(),
    updatedAt: z.date().optional()
});

export default eventSchema;
