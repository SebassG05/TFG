import { z } from 'zod';

const reviewSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    productId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date().optional()
});

export default reviewSchema;
