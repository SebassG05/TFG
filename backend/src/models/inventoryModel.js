import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 0 },
    location: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
