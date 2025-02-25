import mongoose from 'mongoose';
import Review from '../src/models/reviewModel.js';

describe('Review Model Test', () => {
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

    it('create & save review successfully', async () => {
        const validReview = new Review({
            userId: new mongoose.Types.ObjectId(),
            productId: new mongoose.Types.ObjectId(),
            rating: 5,
            comment: 'Excelente producto',
            createdAt: new Date()
        });
        const savedReview = await validReview.save();

        expect(savedReview._id).toBeDefined();
        expect(savedReview.rating).toBe(5);
        expect(savedReview.comment).toBe('Excelente producto');
    });

    it('create review without required field should fail', async () => {
        const reviewWithoutRequiredField = new Review({ rating: 5 });
        let err;
        try {
            await reviewWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.userId).toBeDefined();
        expect(err.errors.productId).toBeDefined();
    });
});
