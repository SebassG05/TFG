import { z } from 'zod';

const favoriteShoesSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    shoeId: z.string().uuid(),
    addedAt: z.date(),
    updatedAt: z.date().optional()
});

export default favoriteShoesSchema;
