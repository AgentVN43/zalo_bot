/**
 * Default Message Handler
 * Handles any message that is not a command.
 *
 * Business logic example: forward the message to an external endpoint
 * (FORWARD_API_URL) and reply based on the result. If no endpoint is
 * configured, fall back to a simple echo.
 */
const { forwardMessage, isForwardEnabled } = require('../../services/forwardService');
const { sendMessage } = require('../../services/notificationService');
const logger = require('../../utils/logger');

/**
 * Handle default (non-command) message
 * @param {Object} bot - Zalo bot instance
 * @param {string} userId - User ID
 * @param {string} text - Message text
 */
async function handleDefaultMessage(bot, userId, text) {
  if (!isForwardEnabled()) {
    await sendMessage(bot, userId, `🤖 Bạn vừa nói: ${text}\n\nGõ /help để xem hướng dẫn.`);
    return;
  }

  try {
    const result = await forwardMessage({ userId, text });

    // Reply with the endpoint's message if it provides one, else a generic ack
    const reply = result?.message || '✅ Đã ghi nhận tin nhắn của bạn.';
    await sendMessage(bot, userId, reply);
  } catch (err) {
    logger.error('Default handler error', { userId, error: err.message });
    await sendMessage(bot, userId, '❌ Hệ thống đang bận, vui lòng thử lại sau.');
  }
}

module.exports = handleDefaultMessage;
