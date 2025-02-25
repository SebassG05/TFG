import { z } from 'zod';
import inventorySchema from '../src/schemas/inventorySchema.js';

describe('Inventory Schema Test', () => {
    it('should validate a valid inventory entry', () => {
        const validInventory = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            productId: '123e4567-e89b-12d3-a456-426614174001',
            quantity: 100,
            location: 'Warehouse A',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        expect(() => inventorySchema.parse(validInventory)).not.toThrow();
    });

    it('should fail validation for an invalid inventory entry', () => {
        const invalidInventory = {
            quantity: 100
        };
        expect(() => inventorySchema.parse(invalidInventory)).toThrow();
    });
});
