import Product from '../models/productModel.js';

export const createProduct = async (req, res) => {
    // Convierte los campos numéricos a number si vienen como string (por FormData)
    const { name, brand, sizeMin, sizeMax, color, price, stock, category } = req.body;
    // Si algún campo falta, responde con error claro
    if (!name || !brand || !sizeMin || !sizeMax || !color || !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    let nSizeMin = Number(sizeMin);
    let nSizeMax = Number(sizeMax);
    let nPrice = Number(price);
    let nStock = Number(stock);
    if (isNaN(nSizeMin) || isNaN(nSizeMax) || isNaN(nPrice) || isNaN(nStock)) {
        return res.status(400).json({ message: 'Tallas, precio y stock deben ser números válidos.' });
    }
    if (nSizeMin > nSizeMax) {
        return res.status(400).json({ message: 'La talla mínima no puede ser mayor que la máxima.' });
    }
    let images = req.body.images || [];
    if (req.files && Array.isArray(req.files)) {
        images = req.files.map(file => file.path);
    }
    try {
        const newProduct = new Product({
            name: name,
            brand: brand,
            sizeMin: nSizeMin,
            sizeMax: nSizeMax,
            color: color,
            price: nPrice,
            stock: nStock,
            category: category,
            images: images,
            proveedor: req.user._id // Asocia el producto al proveedor autenticado
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message, errors: error.errors });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;    const { name, brand, sizeMin, sizeMax, color, price, stock, category } = req.body;
//hola
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, brand, sizeMin, sizeMax, color, price, stock, category },
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
    const { name, brand, color, category, priceMin, priceMax } = req.query;

    try {
        const query = {};

        if (name) query.name = { $regex: name, $options: 'i' };
        if (brand) query.brand = { $regex: brand, $options: 'i' };
        if (color) query.color = { $regex: color, $options: 'i' };
        if (category) query.category = { $regex: category, $options: 'i' };
        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) query.price.$gte = Number(priceMin);
            if (priceMax) query.price.$lte = Number(priceMax);
        }

        const products = await Product.find(query).populate('proveedor', 'username empresa email');
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const voteProduct = async (req, res) => {
    const { productId } = req.body;

    try {
        // Solo actualiza el campo votes, sin requerir validación de otros campos
        const product = await Product.findByIdAndUpdate(
            productId,
            { $inc: { votes: 1 } },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
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

export const getProductosProveedor = async (req, res) => {
    try {
        const productos = await Product.find({ proveedor: req.user._id });
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getVotosProductos = async (req, res) => {
    try {
        const products = await Product.find();
        // Devuelve un objeto { [id]: votos }
        const votos = {};
        products.forEach(p => {
            votos[p._id] = p.votes || 0;
        });
        res.status(200).json(votos);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
