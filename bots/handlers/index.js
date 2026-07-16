/**
 * Bot Message Handlers - Main Router
 */
const logger = require('../../utils/logger');
const handleReportCommand = require('./report');
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
      if (text.startsWith('/report') || text.startsWith('/orders')) {
        await handleReportCommand(bot, userId, text);
        return;
      }

      if (text === '/help') {
        await handleHelpCommand(bot, userId);
        return;
      }

      if (text.startsWith('/')) {
        await bot.sendMessage(userId, 
          '📋 Commands available:\n• /report [YYYY-MM-DD] - Xem report order\n• /help - Hướng dẫn'
        );
        return;
      }

      // Default: forward to default handler
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
