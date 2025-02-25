import mongoose from 'mongoose';
import FavoriteShoes from '../src/models/favoriteShoesModel.js';

describe('Favorite Shoes Model Test', () => {
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
