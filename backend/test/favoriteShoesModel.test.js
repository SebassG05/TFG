import mongoose from 'mongoose';
import FavoriteShoes from '../src/models/favoriteShoesModel.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Favorite Shoes Model Test', () => {
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

    it('create & save favorite shoes successfully', async () => {
        const validFavoriteShoes = new FavoriteShoes({
            userId: new mongoose.Types.ObjectId(),
            shoeId: new mongoose.Types.ObjectId(),
            addedAt: new Date()
        });
        const savedFavoriteShoes = await validFavoriteShoes.save();

        expect(savedFavoriteShoes._id).toBeDefined();
        expect(savedFavoriteShoes.userId).toBeDefined();
        expect(savedFavoriteShoes.shoeId).toBeDefined();
    });

    it('create favorite shoes without required field should fail', async () => {
        const favoriteShoesWithoutRequiredField = new FavoriteShoes({ addedAt: new Date() });
        let err;
        try {
            await favoriteShoesWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.userId).toBeDefined();
        expect(err.errors.shoeId).toBeDefined();
    });
});
