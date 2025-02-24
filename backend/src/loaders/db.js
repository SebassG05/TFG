import mongoose from 'mongoose';
import config from '../config.js';

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(config.database.MONGO_URI);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;
