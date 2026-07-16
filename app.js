require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const { server: serverConfig, database: dbConfig } = require('./config');
const logger = require('./utils/logger');
const { errorHandler, requestLogger } = require('./middleware');
const { getZaloBot, setupBotHandlers } = require('./bots');
const setupWebhookRoutes = require('./routes/webhook');

const orderRoutes = require('./routes/orders');
const applicantRoutes = require('./routes/applicants');
const paymentRoutes = require('./routes/payment');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');
const exchangeRateRoutes = require('./routes/exchange');
const reminderRoutes = require('./routes/reminders');
const googleCalendarRoutes = require('./routes/googleCalendar');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const port = serverConfig.port;

logger.info(`Starting server in ${serverConfig.nodeEnv} mode`, { port });

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || serverConfig.allowedOrigins.length === 0 || serverConfig.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked origin', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.options('*', cors());
app.set('trust proxy', true);

app.use(express.json({ limit: serverConfig.bodyLimit }));
app.use(express.urlencoded({
  limit: serverConfig.urlEncodedLimit,
  extended: true,
  parameterLimit: serverConfig.parameterLimit,
}));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(requestLogger);

async function connectDatabase() {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    logger.info('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
  } catch (err) {
    logger.error('MongoDB connection failed', err);
    process.exit(1);
  }
}

let bot = null;

async function initializeBots() {
  try {
    bot = getZaloBot();
    setupBotHandlers(bot);
    logger.info('All bots initialized successfully');
    return bot;
  } catch (err) {
    logger.error('Bot initialization failed', err);
    throw err;
  }
}

function setupRoutes() {
  const bp = serverConfig.basePath;

  app.get(`${bp}/health`, (req, res) => {
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: serverConfig.nodeEnv,
    });
  });

  app.use(`${bp}/api/orders`, orderRoutes);
  app.use(`${bp}/api/applicants`, applicantRoutes);
  app.use(`${bp}/api/auth`, authRoutes);
  app.use(`${bp}/api/payment`, paymentRoutes);
  app.use(`${bp}/api/exchange`, exchangeRateRoutes);
  app.use(`${bp}/api/reminders`, reminderRoutes);
  app.use(`${bp}/api/calendar`, googleCalendarRoutes);
  app.use(`${bp}/api/analytics`, analyticsRoutes);
  app.use(`${bp}/api/video`, videoRoutes);

  if (bot) {
    app.use(`${bp}/api/zalo`, setupWebhookRoutes(bot));
  }

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found',
      path: req.path,
      method: req.method,
    });
  });

  app.use(errorHandler);
}

async function startServer() {
  try {
    await connectDatabase();
    await initializeBots();
    setupRoutes();

    const server = app.listen(port, async () => {
      logger.info(`Server running on port ${port}`);
      logger.info(`Time: ${new Date().toLocaleString('vi-VN')}`);

      const { zalo: zaloConfig } = require('./config');
      if (!zaloConfig.polling && bot) {
        try {
          const { setupWebhook } = require('./bots/zalo');
          await setupWebhook(bot);
        } catch (err) {
          logger.warn('Webhook setup failed (non-critical)', err.message);
        }
      }
    });

    const shutdown = (signal) => {
      logger.info(`${signal} signal received: closing server`);
      server.close(() => {
        logger.info('HTTP server closed');
        mongoose.connection.close();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    logger.error('Server startup failed', err);
    process.exit(1);
  }
}

startServer().catch((err) => {
  logger.error('Fatal error', err);
  process.exit(1);
});

module.exports = app;
