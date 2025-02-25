import request from 'supertest';
import app from '../src/app.js';

describe('Index Test', () => {
    it('should start the server and respond to requests', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(404); // Assuming the root route is not defined
    });
});
