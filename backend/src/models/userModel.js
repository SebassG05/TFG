import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const User = mongoose.model('User', userSchema);

export default User;
