require('dotenv').config();

const server = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  basePath: process.env.BASE_PATH || '',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean),
  bodyLimit: '10mb',
  urlEncodedLimit: '10mb',
  parameterLimit: 1000,
};

const zalo = require('./zalo');

module.exports = { server, zalo };
