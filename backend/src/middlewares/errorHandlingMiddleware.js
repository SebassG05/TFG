import logger from '../utils/logger.js';

export function errorHandlingMiddleware(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal Server Error';

    logger.error(`Error processing ${req.method} ${req.url}: ${errorMessage}`, { stack: err.stack });

    res.status(statusCode).json({
        error: errorMessage,
        message: err.message,
    });
}