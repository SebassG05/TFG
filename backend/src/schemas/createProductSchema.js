import { z } from 'zod';

const createProductSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    brand: z.string().min(1, 'Brand is required'),
    size: z.preprocess((val) => Number(val), z.number().min(1, 'Size must be at least 1')),
    color: z.string().min(1, 'Color is required'),
    price: z.preprocess((val) => Number(val), z.number().min(0, 'Price must be a positive number')),
    stock: z.preprocess((val) => Number(val), z.number().min(0, 'Stock must be a non-negative number')),
    category: z.string().min(1, 'Category is required')
});

export default createProductSchema;
