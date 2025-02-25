import productSchema from '../src/schemas/productSchema.js';

describe('Product Schema Test', () => {
    it('should validate a valid product', () => {
        const validProduct = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Zapatillas Deportivas',
            description: 'Zapatillas cómodas para correr',
            price: 59.99,
            stock: 100,
            category: 'zapatillas',
            brand: 'Nike',
            images: ['http://example.com/image1.jpg'],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        expect(() => productSchema.parse(validProduct)).not.toThrow();
    });

    it('should fail validation for an invalid product', () => {
        const invalidProduct = {
            price: 59.99
        };
        expect(() => productSchema.parse(invalidProduct)).toThrow();
    });
});
