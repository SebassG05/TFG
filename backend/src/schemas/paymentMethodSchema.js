import { z } from 'zod';

const paymentMethodSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date().optional()
});

export default paymentMethodSchema;
