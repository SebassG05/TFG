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

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, brand, size, color, price, stock, category } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, brand, size, color, price, stock, category },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const searchProducts = async (req, res) => {
    const { name, brand, color, category } = req.query;

    try {
        const query = {};

        if (name) query.name = { $regex: name, $options: 'i' };
        if (brand) query.brand = { $regex: brand, $options: 'i' };
        if (color) query.color = { $regex: color, $options: 'i' };
        if (category) query.category = { $regex: category, $options: 'i' };

        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const voteProduct = async (req, res) => {
    const { productId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.votes += 1;
        await product.save();

        res.status(200).json({ message: 'Vote added successfully', product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getTopProducts = async (req, res) => {
    try {
        const topProducts = await Product.find().sort({ votes: -1 }).limit(10);
        res.status(200).json(topProducts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
