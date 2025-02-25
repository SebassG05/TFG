import { z } from 'zod';

const purchaseHistorySchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    orders: z.array(z.string().uuid()).min(1, "Debe haber al menos una compra"),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
});

export default purchaseHistorySchema;
