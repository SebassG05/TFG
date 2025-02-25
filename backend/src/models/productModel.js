import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    images: { type: [String] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
