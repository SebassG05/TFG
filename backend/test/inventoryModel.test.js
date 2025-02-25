import mongoose from 'mongoose';
import Inventory from '../src/models/inventoryModel.js';

describe('Inventory Model Test', () => {
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

    it('create & save inventory successfully', async () => {
        const validInventory = new Inventory({
            productId: new mongoose.Types.ObjectId(),
            quantity: 100,
            location: 'Warehouse A',
            createdAt: new Date()
        });
        const savedInventory = await validInventory.save();

        expect(savedInventory._id).toBeDefined();
        expect(savedInventory.quantity).toBe(100);
        expect(savedInventory.location).toBe('Warehouse A');
    });

    it('create inventory without required field should fail', async () => {
        const inventoryWithoutRequiredField = new Inventory({ quantity: 100 });
        let err;
        try {
            await inventoryWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.productId).toBeDefined();
    });
});
