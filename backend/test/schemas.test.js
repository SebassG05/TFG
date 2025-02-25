import { z } from 'zod';
import createShoeSchema from '../src/schemas/createShoeSchema.js';
import loginSchema from '../src/schemas/loginSchema.js';
import registerSchema from '../src/schemas/registerSchema.js';

describe('Schemas Test', () => {
    it('should validate createShoeSchema', () => {
        const data = {
            name: 'Shoe Name',
            brand: 'Brand Name',
            size: 42,
            color: 'Black',
            price: 100
        };
        expect(() => createShoeSchema.parse(data)).not.toThrow();
    });

    it('should validate loginSchema', () => {
        const data = {
            email: 'testuser@example.com',
            password: 'password123'
        };
        expect(() => loginSchema.parse(data)).not.toThrow();
    });

    it('should validate registerSchema', () => {
        const data = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            role: 'user'
        };
        expect(() => registerSchema.parse(data)).not.toThrow();
    });
});
