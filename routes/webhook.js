const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

module.exports = function setupWebhookRoutes(bot) {
  router.post('/webhook', (req, res) => {
    try {
      const body = req.body;

      if (!body) {
        return res.status(400).json({ success: false, error: 'No body' });
      }

      logger.debug('Webhook received', { event: body.event_name });

      bot.processUpdate(body);

      res.status(200).json({ success: true });
    } catch (err) {
      logger.error('Webhook processing error', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  router.get('/webhook', (req, res) => {
    res.json({ success: true, message: 'Zalo webhook endpoint is active' });
  });

  return router;
};
