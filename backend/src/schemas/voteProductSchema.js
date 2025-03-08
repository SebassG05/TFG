import { z } from 'zod';

const voteProductSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
});

export default voteProductSchema;
