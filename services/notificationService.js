const logger = require('../utils/logger');

async function sendMessage(bot, userId, text) {
  try {
    await bot.sendMessage(userId, text);
    logger.debug('Message sent', { userId, textLength: text.length });
  } catch (err) {
    logger.error('Failed to send message', { userId, error: err.message });
    throw err;
  }
}

module.exports = { sendMessage };
