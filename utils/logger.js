const { createLogger, format, transports } = require('winston');
const path = require('path');

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let log = `${timestamp} [${level}]: ${message}`;
  if (stack) {
    log += `\n${stack}`;
  }
  if (Object.keys(meta).length > 0) {
    log += ` ${JSON.stringify(meta)}`;
  }
  return log;
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat,
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

module.exports = logger;
