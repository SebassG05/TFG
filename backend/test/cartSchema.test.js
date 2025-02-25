import { z } from 'zod';
import cartSchema from '../src/schemas/cartSchema.js';

describe('Cart Schema Test', () => {
    it('should validate a valid cart', () => {
        const validCart = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            userId: '123e4567-e89b-12d3-a456-426614174001',
            items: [
                {
                    productId: '123e4567-e89b-12d3-a456-426614174002',
                    quantity: 2,
                    price: 29.99
                }
            ],
            totalPrice: 59.98,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        expect(() => cartSchema.parse(validCart)).not.toThrow();
    });

    it('should fail validation for an invalid cart', () => {
        const invalidCart = {
            userId: '123e4567-e89b-12d3-a456-426614174001',
            items: [],
            totalPrice: 59.98
        };
        expect(() => cartSchema.parse(invalidCart)).toThrow();
    });
});
