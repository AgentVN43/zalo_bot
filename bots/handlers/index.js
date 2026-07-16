/**
 * Bot Message Handlers - Main Router
 *
 * Add new commands here: match the incoming text and delegate
 * to a dedicated handler file in this directory.
 */
const logger = require('../../utils/logger');
const handleHelpCommand = require('./help');
const handleDefaultMessage = require('./default');

/**
 * Setup all message handlers
 * @param {Object} bot - Zalo bot instance
 */
function setupMessageHandlers(bot) {
  bot.on('message', async (msg) => {
    const userId = msg.chat?.id;
    const text = msg.text?.trim();

    if (!userId || !text) {
      logger.debug('Invalid message received', { userId, text });
      return;
    }

    logger.info('Message received', { userId, text: text.substring(0, 50) });

    try {
      // Route based on command
      if (text === '/help' || text === '/start') {
        await handleHelpCommand(bot, userId);
        return;
      }

      // Unknown command
      if (text.startsWith('/')) {
        await bot.sendMessage(userId, '📋 Lệnh không hợp lệ. Gõ /help để xem hướng dẫn.');
        return;
      }

      // Default: non-command message
      await handleDefaultMessage(bot, userId, text);
    } catch (err) {
      logger.error('Message handler error', err);
      try {
        await bot.sendMessage(userId, '❌ Có lỗi xảy ra. Vui lòng thử lại.');
      } catch (sendErr) {
        logger.error('Failed to send error message', sendErr);
      }
    }
  });

  logger.info('Message handlers registered');
}

module.exports = setupMessageHandlers;
