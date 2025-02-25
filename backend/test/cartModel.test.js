import mongoose from 'mongoose';
import Cart from '../src/models/cartModel.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Cart Model Test', () => {
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

    it('create & save cart successfully', async () => {
        const validCart = new Cart({
            userId: new mongoose.Types.ObjectId(),
            items: [
                {
                    productId: new mongoose.Types.ObjectId(),
                    quantity: 2,
                    price: 29.99
                }
            ],
            totalPrice: 59.98,
            createdAt: new Date()
        });
        const savedCart = await validCart.save();

        expect(savedCart._id).toBeDefined();
        expect(savedCart.totalPrice).toBe(59.98);
    });

    it('create cart without required field should fail', async () => {
        const cartWithoutRequiredField = new Cart({ totalPrice: 59.98 });
        let err;
        try {
            await cartWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.userId).toBeDefined();
    });
});
