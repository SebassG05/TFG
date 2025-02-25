import mongoose from 'mongoose';
import ShippingAddress from '../src/models/shippingAddressModel.js';

describe('Shipping Address Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    jest.setTimeout(30000); // Aumentar el tiempo de espera a 30 segundos

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
