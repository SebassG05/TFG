import mongoose from 'mongoose';
import Product from '../src/models/productModel.js';
import dotenv from 'dotenv';
import request from 'supertest';
import app from '../src/app.js';

dotenv.config();

describe('Product Model Test', () => {
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

describe('Product Voting', () => {
    let productId;

    beforeAll(async () => {
        const product = new Product({
            name: 'Test Shoe',
            brand: 'Test Brand',
            size: 42,
            color: 'Black',
            price: 100,
            stock: 10,
            category: 'Sneakers'
        });
        const savedProduct = await product.save();
        productId = savedProduct._id;
    });

    it('should vote for a product', async () => {
        const res = await request(app)
            .post('/api/products/vote')
            .send({ productId });

        expect(res.statusCode).toEqual(200);
        expect(res.body.product.votes).toEqual(1);
    });

    it('should get top products', async () => {
        const res = await request(app)
            .get('/api/products/top');

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
