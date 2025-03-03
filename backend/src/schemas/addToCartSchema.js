import { z } from 'zod';

const addToCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1')
});

export default addToCartSchema;