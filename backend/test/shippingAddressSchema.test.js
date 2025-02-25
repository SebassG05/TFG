import shippingAddressSchema from '../src/schemas/shippingAddressSchema.js';

describe('Shipping Address Schema Test', () => {
    it('should validate a valid shipping address', () => {
        const validShippingAddress = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            userId: '123e4567-e89b-12d3-a456-426614174001',
            fullName: 'John Doe',
            street: '123 Main St',
            city: 'Anytown',
            zipCode: '12345',
            country: 'USA',
            phone: '1234567890',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        expect(() => shippingAddressSchema.parse(validShippingAddress)).not.toThrow();
    });

    it('should fail validation for an invalid shipping address', () => {
        const invalidShippingAddress = {
            fullName: 'John Doe'
        };
        expect(() => shippingAddressSchema.parse(invalidShippingAddress)).toThrow();
    });
});
