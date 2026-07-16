const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.get('/', (req, res) => {
  logger.debug('GET /api/applicants');
  res.json({ success: true, data: [], message: 'Applicants endpoint - implement logic' });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  logger.debug('GET /api/applicants/:id', { id });
  res.json({ success: true, data: null, message: `Applicant ${id} - implement logic` });
});

router.post('/', (req, res) => {
  logger.debug('POST /api/applicants', { body: req.body });
  res.status(201).json({ success: true, data: req.body, message: 'Applicant created - implement logic' });
});

module.exports = router;
