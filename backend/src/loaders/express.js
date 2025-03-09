import express from 'express';
import cookieParser from 'cookie-parser';
import indexRoutes from '../routes/indexRoutes.js';
import { swaggerUi, swaggerSpec } from '../config/swagger.js';

const expressLoader = (app) => {
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/api', indexRoutes); // Asegúrate de que esta línea esté presente
};

export default expressLoader;