import mongoose from 'mongoose';
import Inventory from '../src/models/inventoryModel.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Inventory Model Test', () => {
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
