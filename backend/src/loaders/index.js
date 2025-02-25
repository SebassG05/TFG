import expressLoader from './express.js';
import connectDB from './db.js';

function init(app) {
    expressLoader(app);
    connectDB();
}

export default {
    init
};