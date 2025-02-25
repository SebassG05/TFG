import reviewSchema from '../src/schemas/reviewSchema.js';

describe('Review Schema Test', () => {
    it('should validate a valid review', () => {
        const validReview = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            userId: '123e4567-e89b-12d3-a456-426614174001',
            productId: '123e4567-e89b-12d3-a456-426614174002',
            rating: 5,
            comment: 'Excelente producto',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        expect(() => reviewSchema.parse(validReview)).not.toThrow();
    });

    it('should fail validation for an invalid review', () => {
        const invalidReview = {
            rating: 5
        };
        expect(() => reviewSchema.parse(invalidReview)).toThrow();
    });
});
