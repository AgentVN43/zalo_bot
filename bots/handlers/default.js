/**
 * Default Message Handler
 * Handles any message that is not a command.
 * Replace the echo below with your own logic.
 */
const { sendMessage } = require('../../services/notificationService');
const logger = require('../../utils/logger');

/**
 * Handle default (non-command) message
 * @param {Object} bot - Zalo bot instance
 * @param {string} userId - User ID
 * @param {string} text - Message text
 */
async function handleDefaultMessage(bot, userId, text) {
  try {
    await sendMessage(bot, userId, `🤖 Bạn vừa nói: ${text}\n\nGõ /help để xem hướng dẫn.`);
    logger.info('Default message handled', { userId, textLength: text.length });
  } catch (err) {
    logger.error('Default handler error', { userId, error: err.message });
  }
}

module.exports = handleDefaultMessage;
