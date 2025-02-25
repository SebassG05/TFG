import { z } from 'zod';

const orderSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    products: z.array(
        z.object({
            productId: z.string().uuid(),
            quantity: z.number().min(1, "Debe haber al menos un producto"),
            price: z.number().min(0, "El precio no puede ser negativo"),
        })
    ),
    totalPrice: z.number().min(0, "El total no puede ser negativo"),
    status: z.enum(["pendiente", "pagado", "enviado", "entregado", "cancelado"]),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
});

export default orderSchema;
