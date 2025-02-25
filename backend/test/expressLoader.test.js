import express from 'express';
import expressLoader from '../src/loaders/express.js';

describe('Express Loader Test', () => {
    it('should initialize express app', () => {
        const app = express();
        expressLoader(app);
        expect(app).toBeDefined();
    });
});
