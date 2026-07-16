/**
 * Bot Initialization and Export
 */
const logger = require('../utils/logger');
const { initZaloBot } = require('./zalo');

let botInstance = null;

/**
 * Initialize and get Zalo bot instance
 * @returns {Object} Zalo bot instance
 */
function getZaloBot() {
  if (!botInstance) {
    botInstance = initZaloBot();
  }
  return botInstance;
}

/**
 * Setup all bot event handlers
 * @param {Object} bot - Bot instance
 * @returns {void}
 */
function setupBotHandlers(bot) {
  const setupMessageHandlers = require('./handlers');
  
  try {
    setupMessageHandlers(bot);
    logger.info('✅ Bot handlers setup successfully');
  } catch (err) {
    logger.error('❌ Bot handlers setup failed', err);
    throw err;
  }
}

module.exports = {
  getZaloBot,
  setupBotHandlers,
};
