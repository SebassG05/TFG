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
                CreateProduct: {
                    type: 'object',
                    required: ['name', 'brand', 'size', 'color', 'price', 'stock', 'category'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the product',
                        },
                        brand: {
                            type: 'string',
                            description: 'The brand of the product',
                        },
                        size: {
                            type: 'number',
                            description: 'The size of the product',
                        },
                        color: {
                            type: 'string',
                            description: 'The color of the product',
                        },
                        price: {
                            type: 'number',
                            description: 'The price of the product',
                        },
                        stock: {
                            type: 'number',
                            description: 'The stock of the product',
                        },
                        category: {
                            type: 'string',
                            description: 'The category of the product',
                        },
                    },
                    example: {
                        name: 'Product Name',
                        brand: 'Brand Name',
                        size: 10,
                        color: 'Red',
                        price: 100,
                        stock: 50,
                        category: 'Category Name',
                    },
                },
                UpdateProduct: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the product',
                        },
                        brand: {
                            type: 'string',
                            description: 'The brand of the product',
                        },
                        size: {
                            type: 'number',
                            description: 'The size of the product',
                        },
                        color: {
                            type: 'string',
                            description: 'The color of the product',
                        },
                        price: {
                            type: 'number',
                            description: 'The price of the product',
                        },
                        stock: {
                            type: 'number',
                            description: 'The stock of the product',
                        },
                        category: {
                            type: 'string',
                            description: 'The category of the product',
                        },
                    },
                    example: {
                        name: 'Updated Product Name',
                        brand: 'Updated Brand Name',
                        size: 12,
                        color: 'Blue',
                        price: 120,
                        stock: 30,
                        category: 'Updated Category Name',
                    },
                },
                Product: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'The product ID',
                        },
                        name: {
                            type: 'string',
                            description: 'The name of the product',
                        },
                        brand: {
                            type: 'string',
                            description: 'The brand of the product',
                        },
                        size: {
                            type: 'number',
                            description: 'The size of the product',
                        },
                        color: {
                            type: 'string',
                            description: 'The color of the product',
                        },
                        price: {
                            type: 'number',
                            description: 'The price of the product',
                        },
                        stock: {
                            type: 'number',
                            description: 'The stock of the product',
                        },
                        category: {
                            type: 'string',
                            description: 'The category of the product',
                        },
                        votes: {
                            type: 'number',
                            description: 'The number of votes the product has received',
                        },
                    },
                    example: {
                        id: '60c72b2f9b1d8e001c8e4b8e',
                        name: 'Product Name',
                        brand: 'Brand Name',
                        size: 10,
                        color: 'Red',
                        price: 100,
                        stock: 50,
                        category: 'Category Name',
                        votes: 5,
                    },
                },
                VoteProduct: {
                    type: 'object',
                    required: ['productId'],
                    properties: {
                        productId: {
                            type: 'string',
                            description: 'The ID of the product to vote for',
                        },
                    },
                    example: {
                        productId: '60c72b2f9b1d8e001c8e4b8e',
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'], // Archivos que contienen anotaciones Swagger
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
