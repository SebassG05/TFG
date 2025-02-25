import userSchema from '../src/schemas/userSchema.js';

describe('User Schema Test', () => {
    it('should validate a valid user', () => {
        const validUser = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            role: 'customer',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        expect(() => userSchema.parse(validUser)).not.toThrow();
    });

    it('should fail validation for an invalid user', () => {
        const invalidUser = {
            email: 'testuser@example.com'
        };
        expect(() => userSchema.parse(invalidUser)).toThrow();
    });
});
