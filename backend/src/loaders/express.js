import express from 'express';
import { loggerMiddleware } from '../middlewares/loggerMiddleware.js';
import { errorHandlingMiddleware } from '../middlewares/errorHandlingMiddleware.js';

export default function (app) {
    app.use(loggerMiddleware);
    app.use(express.json());
    app.use(errorHandlingMiddleware);
}