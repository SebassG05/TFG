import mongoose from 'mongoose';
import PaymentMethod from '../src/models/paymentMethodModel.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Payment Method Model Test', () => {
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

    it('create & save payment method successfully', async () => {
        const validPaymentMethod = new PaymentMethod({
            name: 'Tarjeta de Crédito',
            description: 'Pago con tarjeta de crédito'
        });
        const savedPaymentMethod = await validPaymentMethod.save();

        expect(savedPaymentMethod._id).toBeDefined();
        expect(savedPaymentMethod.name).toBe('Tarjeta de Crédito');
        expect(savedPaymentMethod.description).toBe('Pago con tarjeta de crédito');
    });

    it('create payment method without required field should fail', async () => {
        const paymentMethodWithoutRequiredField = new PaymentMethod({ description: 'Método sin nombre' });
        let err;
        try {
            await paymentMethodWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.name).toBeDefined();
    });
});
