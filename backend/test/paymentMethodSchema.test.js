import paymentMethodSchema from '../src/schemas/paymentMethodSchema.js';

describe('Payment Method Schema Test', () => {
    it('should validate a valid payment method', () => {
        const validPaymentMethod = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Tarjeta de Crédito',
            description: 'Pago con tarjeta de crédito',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        expect(() => paymentMethodSchema.parse(validPaymentMethod)).not.toThrow();
    });

    it('should fail validation for an invalid payment method', () => {
        const invalidPaymentMethod = {
            description: 'Método sin nombre'
        };
        expect(() => paymentMethodSchema.parse(invalidPaymentMethod)).toThrow();
    });
});
