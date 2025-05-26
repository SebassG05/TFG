import { z } from 'zod';

export const sugerenciaSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  mensaje: z.string().min(3, 'La sugerencia debe tener al menos 3 caracteres'),
});
