import { z } from 'zod';
import purchaseHistorySchema from './purchaseHistorySchema.js';

const userSchema = z.object({
    id: z.string().uuid(),
    username: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['customer', 'admin']),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
    purchaseHistory: z.array(purchaseHistorySchema).optional(),
});

export default userSchema;
