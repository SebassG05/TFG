import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import indexRoutes from '../routes/indexRoutes.js';
import { swaggerUi, swaggerSpec } from '../config/swagger.js';

const expressLoader = (app) => {
    // Permitir todos los orígenes temporalmente para descartar problemas de CORS
    app.use(cors({
        origin: '*'
    }));
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/api', indexRoutes);
};

export default expressLoader;