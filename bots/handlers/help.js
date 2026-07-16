/**
 * Help Command Handler - /help, /start
 */
const { sendMessage } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const HELP_MESSAGE = `📋 *Available Commands:*

• /help
  Hiển thị hướng dẫn này

(Thêm mô tả lệnh mới của bạn tại đây)`;

/**
 * Handle /help command
 * @param {Object} bot - Zalo bot instance
 * @param {string} userId - User ID
 */
async function handleHelpCommand(bot, userId) {
  try {
    await sendMessage(bot, userId, HELP_MESSAGE);
    logger.info('Help message sent', { userId });
  } catch (err) {
    logger.error('Failed to send help message', { userId, error: err.message });
  }
}

module.exports = handleHelpCommand;
