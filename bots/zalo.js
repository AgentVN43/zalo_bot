const ZaloBot = require('node-zalo-bot');
const config = require('../config/zalo');
const logger = require('../utils/logger');

let botInstance = null;

function initZaloBot() {
  try {
    if (botInstance) {
      return botInstance;
    }

    botInstance = new ZaloBot(config.token, {
      polling: config.polling,
    });

    logger.info('Zalo bot initialized', { token: config.token.substring(0, 20) + '...' });
    return botInstance;
  } catch (err) {
    logger.error('Bot initialization failed', err);

    botInstance = {
      on: (event, handler) => {
        logger.warn(`Mock bot listener: ${event}`);
      },
      processUpdate: (body) => {
        logger.warn('Mock processUpdate called', { body });
      },
      sendMessage: async (userId, message) => {
        logger.warn('Mock sendMessage called', { userId, message });
      },
      setWebHook: async (url, options) => {
        logger.warn('Mock setWebHook called', { url });
      },
    };

    return botInstance;
  }
}

async function setupWebhook(bot) {
  try {
    await bot.setWebHook(config.webhookUrl, {
      secret_token: config.secretToken,
    });
    logger.info('Webhook registered', { url: config.webhookUrl });
  } catch (err) {
    logger.error('Webhook setup failed', err);
    throw err;
  }
}

module.exports = {
  initZaloBot,
  setupWebhook,
};
