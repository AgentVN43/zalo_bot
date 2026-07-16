const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.get('/current', (req, res) => {
  logger.debug('GET /api/exchange/current');
  res.json({ success: true, data: null, message: 'Current exchange rate - implement logic' });
});

router.get('/history', (req, res) => {
  logger.debug('GET /api/exchange/history');
  res.json({ success: true, data: [], message: 'Exchange rate history - implement logic' });
});

module.exports = router;
