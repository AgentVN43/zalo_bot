/**
 * Zalo Bot Configuration
 */
require('dotenv').config();

module.exports = {
  token: process.env.ZALO_TOKEN || '1399580145398073164:TxQdAbijyNnmWwQuXUDRGkHrmqTtMlbkUlHyjxgslxiCAvFusCeGstqmYJjACdzs',
  webhookUrl: process.env.ZALO_WEBHOOK_URL || 'https://bot.annk.info/zalo/api/zalo/webhook',
  secretToken: process.env.ZALO_SECRET_TOKEN || 'nguyenhokimdieulinhan',
  polling: process.env.ZALO_POLLING === 'true',
  allowedUsers: (process.env.ALLOWED_REPORT_USERS || 'f1f2ba5e221dcb43920c').split(',').filter(Boolean),
  baseUrl: process.env.BASE_URL || 'https://bot.annk.info/zalo',
  reminderApiUrl: process.env.REMINDER_API_URL || 'https://bot.annk.info/zalo/api/reminder',
};
