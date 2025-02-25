import mongoose from 'mongoose';
import Category from '../src/models/categoryModel.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Category Model Test', () => {
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

    it('create & save category successfully', async () => {
        const validCategory = new Category({
            name: 'Zapatillas',
            description: 'Categoría de zapatillas'
        });
        const savedCategory = await validCategory.save();

        expect(savedCategory._id).toBeDefined();
        expect(savedCategory.name).toBe('Zapatillas');
        expect(savedCategory.description).toBe('Categoría de zapatillas');
    });

    it('create category without required field should fail', async () => {
        const categoryWithoutRequiredField = new Category({ description: 'Categoría sin nombre' });
        let err;
        try {
            await categoryWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.name).toBeDefined();
    });
});
