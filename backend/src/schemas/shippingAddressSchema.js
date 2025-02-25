import { z } from 'zod';

const shippingAddressSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    street: z.string().min(5, "La calle debe tener al menos 5 caracteres"),
    city: z.string().min(2, "Debe indicar una ciudad válida"),
    zipCode: z.string().min(3, "Debe indicar un código postal válido"),
    country: z.string().min(2, "Debe indicar un país válido"),
    phone: z.string().min(9, "Debe ingresar un número de teléfono válido"),
    isDefault: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
});

export default shippingAddressSchema;
