import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import indexRoutes from '../routes/indexRoutes.js';
import { swaggerUi, swaggerSpec } from '../config/swagger.js';

const expressLoader = (app) => {
    app.use(cors({
        origin: 'http://localhost:4200', // Permite peticiones desde tu frontend Angular
        credentials: true
    }));
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/api', indexRoutes);
};

export default expressLoader;