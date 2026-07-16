/**
 * Default Message Handler - Forward to reminder API
 */
const axios = require('axios');
const config = require('../../config/zalo');
const logger = require('../../utils/logger');

/**
 * Handle default message (forward to reminder API)
 * @param {Object} bot - Zalo bot instance
 * @param {string} userId - User ID
 * @param {string} text - Message text
 */
async function handleDefaultMessage(bot, userId, text) {
  try {
    // Forward message to reminder API
    await axios.post(config.reminderApiUrl, {
      userId,
      message: `Reminder auto: ${text}`
    }, {
      timeout: 5000
    });

    logger.info('Message forwarded to reminder API', { userId, textLength: text.length });
  } catch (err) {
    // Log error but don't notify user (avoid spam)
    logger.warn('Reminder API error', { userId, error: err.message });
    // Optionally send a message to user
    // await bot.sendMessage(userId, '📝 Ghi chú đã được lưu.');
  }
}

module.exports = handleDefaultMessage;
