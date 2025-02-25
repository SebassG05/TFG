import mongoose from 'mongoose';

const favoriteShoesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shoeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    addedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const FavoriteShoes = mongoose.model('FavoriteShoes', favoriteShoesSchema);

export default FavoriteShoes;
