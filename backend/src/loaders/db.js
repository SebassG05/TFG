import mongoose from 'mongoose';
import config from '../config.js';

const connectDB = async () => {
    try {
        await mongoose.connect(config.database.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;
