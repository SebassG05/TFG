import mongoose from 'mongoose';
import ShippingAddress from '../src/models/shippingAddressModel.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Shipping Address Model Test', () => {
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

    it('create & save shipping address successfully', async () => {
        const validShippingAddress = new ShippingAddress({
            userId: new mongoose.Types.ObjectId(),
            fullName: 'John Doe',
            street: '123 Main St',
            city: 'Anytown',
            zipCode: '12345',
            country: 'USA',
            phone: '1234567890',
            isDefault: true,
            createdAt: new Date()
        });
        const savedShippingAddress = await validShippingAddress.save();

        expect(savedShippingAddress._id).toBeDefined();
        expect(savedShippingAddress.fullName).toBe('John Doe');
        expect(savedShippingAddress.street).toBe('123 Main St');
    });

    it('create shipping address without required field should fail', async () => {
        const shippingAddressWithoutRequiredField = new ShippingAddress({ fullName: 'John Doe' });
        let err;
        try {
            await shippingAddressWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.street).toBeDefined();
    });
});
