import mongoose from 'mongoose';
import Product from '../src/models/productModel.js';

describe('Product Model Test', () => {
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

    it('create & save product successfully', async () => {
        const validProduct = new Product({
            name: 'Zapatillas Deportivas',
            description: 'Zapatillas cómodas para correr',
            price: 59.99,
            stock: 100,
            category: 'zapatillas',
            brand: 'Nike',
            images: ['http://example.com/image1.jpg'],
            createdAt: new Date()
        });
        const savedProduct = await validProduct.save();

        expect(savedProduct._id).toBeDefined();
        expect(savedProduct.name).toBe('Zapatillas Deportivas');
        expect(savedProduct.price).toBe(59.99);
    });

    it('create product without required field should fail', async () => {
        const productWithoutRequiredField = new Product({ price: 59.99 });
        let err;
        try {
            await productWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.name).toBeDefined();
    });
});
