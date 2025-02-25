import mongoose from 'mongoose';
import Order from '../src/models/orderModel.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Order Model Test', () => {
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

    it('create & save order successfully', async () => {
        const validOrder = new Order({
            userId: new mongoose.Types.ObjectId(),
            products: [
                {
                    productId: new mongoose.Types.ObjectId(),
                    quantity: 2,
                    price: 29.99
                }
            ],
            totalPrice: 59.98,
            status: 'pendiente',
            createdAt: new Date()
        });
        const savedOrder = await validOrder.save();

        expect(savedOrder._id).toBeDefined();
        expect(savedOrder.totalPrice).toBe(59.98);
        expect(savedOrder.status).toBe('pendiente');
    });

    it('create order without required field should fail', async () => {
        const orderWithoutRequiredField = new Order({ totalPrice: 59.98 });
        let err;
        try {
            await orderWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.userId).toBeDefined();
    });
});
