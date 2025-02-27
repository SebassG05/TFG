import { z } from 'zod';

const updateProductSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    brand: z.string().min(1, 'Brand is required').optional(),
    size: z.number().min(1, 'Size must be at least 1').optional(),
    color: z.string().min(1, 'Color is required').optional(),
    price: z.number().min(0, 'Price must be a positive number').optional(),
    stock: z.number().min(0, 'Stock must be a non-negative number').optional(),
    category: z.string().min(1, 'Category is required').optional()
});

export default updateProductSchema;
