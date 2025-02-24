import expressLoader from './express.js';
import connectDB from './db.js';

function init(app) {
    expressLoader(app);
    initDB();
}

function initDB() {
    connectDB();
}

export default {
    init,
    initDB
};