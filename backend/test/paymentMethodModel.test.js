import mongoose from 'mongoose';
import PaymentMethod from '../src/models/paymentMethodModel.js';

describe('Payment Method Model Test', () => {
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
