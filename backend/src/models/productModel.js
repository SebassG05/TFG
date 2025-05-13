import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    size: { type: Number, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    votes: { type: Number, default: 0 },
    imageUrl: { type: String }, // Para Cloudinary
    images: [{ type: String }], // Array de URLs de imágenes
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
