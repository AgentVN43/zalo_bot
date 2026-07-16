const axios = require('axios');
const logger = require('../utils/logger');
const { reminderApiUrl } = require('../config/zalo');

async function generateOrderReport(dateParam) {
  try {
    const date = dateParam || new Date().toISOString().slice(0, 10);
    const response = await axios.get(`${reminderApiUrl}/report`, {
      params: { date },
      timeout: 10000,
    });
    return response.data;
  } catch (err) {
    logger.error('Failed to generate order report', { dateParam, error: err.message });
    throw err;
  }
}

function formatReportMessage(report) {
  if (!report || !report.orders) {
    return '📋 Không có dữ liệu report.';
  }

  const { reportDate, orders, total } = report;
  let message = `📊 *REPORT - ${reportDate}*\n\n`;

  if (orders.length === 0) {
    message += 'Không có order nào.';
  } else {
    orders.forEach((order, index) => {
      message += `${index + 1}. ${order.id} - ${order.status}\n`;
    });
    message += `\nTổng: ${total || orders.length} orders`;
  }

  return message;
}

module.exports = { generateOrderReport, formatReportMessage };
