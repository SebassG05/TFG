import { z } from 'zod';
import favoriteShoesSchema from '../src/schemas/favoriteShoesSchema.js';

describe('Favorite Shoes Schema Test', () => {
    it('should validate a valid favorite shoes entry', () => {
        const validFavoriteShoes = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            userId: '123e4567-e89b-12d3-a456-426614174001',
            shoeId: '123e4567-e89b-12d3-a456-426614174002',
            addedAt: new Date(),
            updatedAt: new Date()
        };
        expect(() => favoriteShoesSchema.parse(validFavoriteShoes)).not.toThrow();
    });

    it('should fail validation for an invalid favorite shoes entry', () => {
        const invalidFavoriteShoes = {
            userId: '123e4567-e89b-12d3-a456-426614174001'
        };
        expect(() => favoriteShoesSchema.parse(invalidFavoriteShoes)).toThrow();
    });
});
