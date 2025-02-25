import mongoose from 'mongoose';
import Category from '../src/models/categoryModel.js';

describe('Category Model Test', () => {
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
