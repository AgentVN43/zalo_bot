/**
 * Request Logging Middleware
 */
const logger = require('../utils/logger');

/**
 * Log incoming HTTP requests
 */
function requestLogger(req, res, next) {
  const startTime = Date.now();

  // Capture response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.http(`${req.method} ${req.path} - ${res.statusCode}`, {
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
}

module.exports = requestLogger;
