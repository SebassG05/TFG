import mongoose from 'mongoose';

const purchaseHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const PurchaseHistory = mongoose.model('PurchaseHistory', purchaseHistorySchema);

export default PurchaseHistory;
