import express from 'express';
import indexRoutes from '../routes/indexRoutes.js';

const expressLoader = (app) => {
    app.use(express.json());
    app.use('/api', indexRoutes); // Asegúrate de que esta línea esté presente
};

export default expressLoader;