import { z } from 'zod';

const registerSchema = z.object({
    username: z.string().min(1).trim().nonempty().unique(),
    email: z.string().email().trim().nonempty().unique(),
    password: z.string().min(1)
});

export default registerSchema;
