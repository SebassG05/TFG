import Product from '../models/productModel.js';

export const createProduct = async (req, res) => {
    const { name, brand, size, color, price, stock, category } = req.body;

    try {
        const newProduct = new Product({
            name,
            brand,
            size,
            color,
            price,
            stock,
            category
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
