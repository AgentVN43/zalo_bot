/**
 * Help Command Handler - /help
 */
const { sendMessage } = require('../../services/notificationService');
const logger = require('../../utils/logger');

const HELP_MESSAGE = `📋 *Available Commands:*

• /report [YYYY-MM-DD]
  Xem report order theo ngày
  Ví dụ: /report 2026-04-01
  Không có date → xem hôm nay

• /orders [YYYY-MM-DD]
  Tương tự /report

• /help
  Hiển thị hướng dẫn này

🔐 Chỉ admin mới xem được report.`;

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
