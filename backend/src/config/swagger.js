import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for the project',
        },
        servers: [
            {
                url: 'http://localhost:4000/api',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Register: {
                    type: 'object',
                    required: ['username', 'email', 'password', 'role'],
                    properties: {
                        username: {
                            type: 'string',
                            description: "The user's username",
                        },
                        email: {
                            type: 'string',
                            description: "The user's email",
                        },
                        password: {
                            type: 'string',
                            description: "The user's password",
                        },
                        role: {
                            type: 'string',
                            description: "The user's role",
                        },
                    },
                    example: {
                        username: 'johndoe',
                        email: 'johndoe@example.com',
                        password: 'password123',
                        role: 'user',
                    },
                },
                Login: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            description: "The user's email",
                        },
                        password: {
                            type: 'string',
                            description: "The user's password",
                        },
                    },
                    example: {
                        email: 'johndoe@example.com',
                        password: 'password123',
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'], // Archivos que contienen anotaciones Swagger
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
