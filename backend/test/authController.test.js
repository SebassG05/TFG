import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/userModel.js';
import dotenv from 'dotenv';
import { sendEmail } from '../src/services/emailService.js';

dotenv.config();

jest.mock('../src/services/emailService.js');

describe('Auth Controller Test', () => {
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

    it('register user successfully', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'user'
            });

        expect(response.status).toBe(201);
        expect(response.body.username).toBe('testuser');
        expect(response.body.email).toBe('testuser@example.com');
    });

    it('login user successfully', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user'
        });
        await user.save();

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    it('login admin successfully with admin password', async () => {
        const admin = new User({
            username: 'adminuser',
            email: 'adminuser@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'admin'
        });
        await admin.save();

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'adminuser@example.com',
                password: 'password123',
                adminPassword: 'soyadmin'
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    it('fail login admin with incorrect admin password', async () => {
        const admin = new User({
            username: 'adminuser',
            email: 'adminuser@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'admin'
        });
        await admin.save();

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'adminuser@example.com',
                password: 'password123',
                adminPassword: 'wrongpassword'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid admin password');
    });

    it('should send forgot password email', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user'
        });
        await user.save();

        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: 'testuser@example.com' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Password reset email sent');
        expect(sendEmail).toHaveBeenCalled();
    });
});
