import { z } from 'zod';

const inventorySchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    quantity: z.number().int().nonnegative(),
    location: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date().optional()
});

export default inventorySchema;
