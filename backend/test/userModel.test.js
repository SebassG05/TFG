import mongoose from 'mongoose';
import User from '../src/models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

describe('User Model Test', () => {
    jest.setTimeout(60000); // Aumentar el tiempo de espera a 60 segundos

    beforeAll(async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    });

    afterAll(async () => {
        try {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
        }
    });

    it('create & save user successfully', async () => {
        const validUser = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            role: 'user', // Cambiado a 'user'
            createdAt: new Date()
        });
        const savedUser = await validUser.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe('testuser');
        expect(savedUser.email).toBe('testuser@example.com');
    });

    it('create user without required field should fail', async () => {
        const userWithoutRequiredField = new User({ email: 'testuser@example.com' });
        let err;
        try {
            await userWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.username).toBeDefined();
    });
});
