/**
 * Zalo Bot Configuration
 * All values must be provided via environment variables (see .env.example)
 */
require('dotenv').config();

module.exports = {
  token: process.env.ZALO_TOKEN || '',
  webhookUrl: process.env.ZALO_WEBHOOK_URL || '',
  secretToken: process.env.ZALO_SECRET_TOKEN || '',
  polling: process.env.ZALO_POLLING === 'true',
};
