import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import indexRoutes from '../routes/indexRoutes.js';
import { swaggerUi, swaggerSpec } from '../config/swagger.js';

const expressLoader = (app) => {
    app.use(cors({
        origin: [
            'http://localhost:4200',
            'https://tfg-jirn-8zpoxhfqo-sebas-projects-2fad30d5.vercel.app'
        ],
        credentials: true
    }));
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/api', indexRoutes);
};

export default expressLoader;