/**
 * Forward Service
 * POST incoming user messages to an external endpoint (FORWARD_API_URL).
 *
 * This is the template's example "business logic" service — copy this
 * pattern for any integration: read config, call the external API with
 * a timeout, log both success and failure, and let the caller decide
 * what to reply to the user.
 */
const { integrations } = require('../config');
const logger = require('../utils/logger');

/**
 * Forward a user message to the configured endpoint
 * @param {Object} payload
 * @param {string} payload.userId - Zalo user ID (scoped to this bot)
 * @param {string} payload.text - Message text
 * @param {string} [payload.eventName] - Zalo event name
 * @returns {Promise<Object|null>} Parsed JSON response from the endpoint (null if no JSON body)
 * @throws {Error} When the endpoint is unreachable, times out, or returns non-2xx
 */
async function forwardMessage(payload) {
  if (!integrations.forwardApiUrl) {
    throw new Error('FORWARD_API_URL is not configured');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), integrations.forwardTimeoutMs);

  try {
    const response = await fetch(integrations.forwardApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(integrations.forwardApiKey && { Authorization: `Bearer ${integrations.forwardApiKey}` }),
      },
      body: JSON.stringify({
        source: 'zalo',
        userId: payload.userId,
        text: payload.text,
        eventName: payload.eventName,
        receivedAt: new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Forward endpoint returned ${response.status}`);
    }

    const data = await response.json().catch(() => null);
    logger.info('Message forwarded', { userId: payload.userId, status: response.status });
    return data;
  } catch (err) {
    const reason = err.name === 'AbortError' ? `timeout after ${integrations.forwardTimeoutMs}ms` : err.message;
    logger.error('Forward failed', { userId: payload.userId, error: reason });
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Whether forwarding is enabled (endpoint configured)
 * @returns {boolean}
 */
function isForwardEnabled() {
  return Boolean(integrations.forwardApiUrl);
}

module.exports = { forwardMessage, isForwardEnabled };
