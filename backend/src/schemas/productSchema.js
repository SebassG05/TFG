import { z } from 'zod';

const productSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    category: z.literal('zapatillas', 'pelotas', 'calentadores'),
    brand: z.string().min(1),
    images: z.array(z.string().url()).optional(),
    createdAt: z.date(),
    updatedAt: z.date().optional()
});

export default productSchema;
