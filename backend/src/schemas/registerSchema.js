import { z } from 'zod';

const registerSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['user', 'admin', 'proveedor'], 'Invalid role'),
    adminPassword: z.string().optional()
});

export default registerSchema;
