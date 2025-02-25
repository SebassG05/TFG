import request from 'supertest';
import app from '../src/app.js';

describe('Index Routes Test', () => {
    it('should return 404 for unknown routes', async () => {
        const response = await request(app).get('/unknown-route');
        expect(response.status).toBe(404);
    });
});
