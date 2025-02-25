import orderSchema from '../src/schemas/orderSchema.js';

describe('Order Schema Test', () => {
    it('should validate a valid order', () => {
        const validOrder = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            userId: '123e4567-e89b-12d3-a456-426614174001',
            products: [
                {
                    productId: '123e4567-e89b-12d3-a456-426614174002',
                    quantity: 2,
                    price: 29.99
                }
            ],
            totalPrice: 59.98,
            status: 'pendiente',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        expect(() => orderSchema.parse(validOrder)).not.toThrow();
    });

    it('should fail validation for an invalid order', () => {
        const invalidOrder = {
            userId: '123e4567-e89b-12d3-a456-426614174001',
            products: [],
            totalPrice: 59.98
        };
        expect(() => orderSchema.parse(invalidOrder)).toThrow();
    });
});
