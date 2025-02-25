import mongoose from 'mongoose';
import connectDB from '../src/loaders/db.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Database Connection Test', () => {
    it('should connect to MongoDB', async () => {
        await connectDB();
        expect(mongoose.connection.readyState).toBe(1); // 1 significa conectado
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
