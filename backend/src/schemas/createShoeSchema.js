import { object, string, number } from 'joi';

const createShoeSchema = object({
    brand: string().min(1).max(50).required(),
    model: string().min(1).max(50).required(),
    size: number().integer().min(1).max(50).required(),
    color: string().min(1).max(30).required(),
    price: number().precision(2).positive().required(),
    stock: number().integer().min(0).required()
});

const updateShoeSchema = createShoeSchema.partial();
export default {createShoeSchema, updateShoeSchema};