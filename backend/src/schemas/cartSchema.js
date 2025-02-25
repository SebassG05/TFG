import { z } from 'zod';

const cartItemSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().min(1, "Debe haber al menos un producto"),
    price: z.number().min(0, "El precio no puede ser negativo"),
});

const cartSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    items: z.array(cartItemSchema),
    totalPrice: z.number().min(0, "El total no puede ser negativo"),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
});

export default cartSchema;
