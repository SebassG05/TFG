import mongoose from 'mongoose';

const proveedorSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const Proveedor = mongoose.model('Proveedor', proveedorSchema);

export default Proveedor;
