/**
 * Global API Error Handler
 * Manages standard status codes for Mongoose, JWT and System errors
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    console.error(`[Error] ${err.name}: ${err.message}`.red || err.stack);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Health Record not found with id of ${err.value}`;
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = { message, statusCode: 400 };
    }

    // JWT Unauthorized
    if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
        error = { message: 'Not authorized to access this clinical data', statusCode: 401 };
    }

    // Multer Errors
    if (err.name === 'MulterError') {
        error = { message: `File upload error: ${err.message}`, statusCode: 400 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'HealthGuard Neural Core Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
