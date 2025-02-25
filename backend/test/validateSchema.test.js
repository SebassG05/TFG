import validateSchema from '../src/middlewares/validateSchema.js';
import registerSchema from '../src/schemas/registerSchema.js';

describe('Validate Schema Middleware Test', () => {
    it('should pass validation with valid data', () => {
        const req = {
            body: {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'user'
            }
        };
        const res = {};
        const next = jest.fn();

        validateSchema(registerSchema)(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should fail validation with invalid data', () => {
        const req = {
            body: {
                email: 'invalid-email',
                password: 'short'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        validateSchema(registerSchema)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.any(Array)
        }));
    });
});
