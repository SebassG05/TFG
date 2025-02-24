import dotenv from 'dotenv';
dotenv.config();

const config = {
    database: {
        MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/24seconds_db'
    },
    
};

export default config;