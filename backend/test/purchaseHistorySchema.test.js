import purchaseHistorySchema from '../src/schemas/purchaseHistorySchema.js';

describe('Purchase History Schema Test', () => {
    it('should validate a valid purchase history', () => {
        const validPurchaseHistory = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            userId: '123e4567-e89b-12d3-a456-426614174001',
            orders: ['123e4567-e89b-12d3-a456-426614174002'],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        expect(() => purchaseHistorySchema.parse(validPurchaseHistory)).not.toThrow();
    });

    it('should fail validation for an invalid purchase history', () => {
        const invalidPurchaseHistory = {
            orders: ['123e4567-e89b-12d3-a456-426614174002']
        };
        expect(() => purchaseHistorySchema.parse(invalidPurchaseHistory)).toThrow();
    });
});
