import { z } from 'zod';
import categorySchema from '../src/schemas/categorySchema.js';

describe('Category Schema Test', () => {
    it('should validate a valid category', () => {
        const validCategory = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Zapatillas',
            description: 'Categoría de zapatillas',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        expect(() => categorySchema.parse(validCategory)).not.toThrow();
    });

    it('should fail validation for an invalid category', () => {
        const invalidCategory = {
            description: 'Categoría sin nombre'
        };
        expect(() => categorySchema.parse(invalidCategory)).toThrow();
    });
});
