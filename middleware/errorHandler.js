/**
 * Global Error Handler Middleware
 */
const logger = require('../utils/logger');

/**
 * Express error handler middleware
 * Must be the last middleware registered
 */
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error('Express error', {
    status,
    message,
    path: req.path,
    method: req.method,
    stack: err.stack
  });

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
