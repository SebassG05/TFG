import mongoose from 'mongoose';

const sorteoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isAuthorized: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    expirationDate: { type: Date, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    hoopCoinsCost: { type: Number, default: 0 } // Nuevo campo
});

export default mongoose.model('Sorteo', sorteoSchema);
