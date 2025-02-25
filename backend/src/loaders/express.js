import express from 'express';
import cookieParser from 'cookie-parser';
import indexRoutes from '../routes/indexRoutes.js';

const expressLoader = (app) => {
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api', indexRoutes);
};

export default expressLoader;