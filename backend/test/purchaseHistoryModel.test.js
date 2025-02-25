import mongoose from 'mongoose';
import PurchaseHistory from '../src/models/purchaseHistoryModel.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Purchase History Model Test', () => {
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

    it('create & save purchase history successfully', async () => {
        const validPurchaseHistory = new PurchaseHistory({
            userId: new mongoose.Types.ObjectId(),
            orders: [new mongoose.Types.ObjectId()],
            createdAt: new Date()
        });
        const savedPurchaseHistory = await validPurchaseHistory.save();

        expect(savedPurchaseHistory._id).toBeDefined();
        expect(savedPurchaseHistory.orders.length).toBe(1);
    });

    it('create purchase history without required field should fail', async () => {
        const purchaseHistoryWithoutRequiredField = new PurchaseHistory({ orders: [new mongoose.Types.ObjectId()] });
        let err;
        try {
            await purchaseHistoryWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.userId).toBeDefined();
    });
});
