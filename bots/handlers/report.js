/**
 * Report Command Handler - /report [date]
 */
const { generateOrderReport, formatReportMessage } = require('../../services/reportService');
const { sendMessage } = require('../../services/notificationService');
const config = require('../../config/zalo');
const logger = require('../../utils/logger');

/**
 * Handle /report or /orders command
 * @param {Object} bot - Zalo bot instance
 * @param {string} userId - User ID
 * @param {string} text - Full command text
 */
async function handleReportCommand(bot, userId, text) {
  // Permission check
  if (!config.allowedUsers.includes(userId)) {
    logger.warn('Unauthorized report attempt', { userId });
    await sendMessage(bot, userId, '❌ Bạn không có quyền xem report.');
    return;
  }

  // Send loading indicator
  await sendMessage(bot, userId, '⏳ Đang tạo report...');

  // Parse date parameter: /report 2026-04-01
  const parts = text.split(/\s+/);
  const dateParam = parts[1]; // Optional

  try {
    // Generate report
    const report = await generateOrderReport(dateParam);
    
    // Format and send message
    const message = formatReportMessage(report);
    await sendMessage(bot, userId, message);
    
    logger.info('Report sent successfully', { userId, reportDate: report.reportDate });
  } catch (err) {
    logger.error('Report generation failed', { userId, error: err.message });
    await sendMessage(bot, userId, '❌ Lỗi khi tạo report. Vui lòng thử lại.');
  }
}

module.exports = handleReportCommand;
