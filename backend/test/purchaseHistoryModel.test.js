import mongoose from 'mongoose';
import PurchaseHistory from '../src/models/purchaseHistoryModel.js';

describe('Purchase History Model Test', () => {
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
