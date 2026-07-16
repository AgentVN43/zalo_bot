require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { server: serverConfig, zalo: zaloConfig } = require('./config');
const logger = require('./utils/logger');
const { errorHandler, requestLogger } = require('./middleware');
const { getZaloBot, setupBotHandlers } = require('./bots');
const setupWebhookRoutes = require('./routes/webhook');

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

app.use(requestLogger);

let bot = null;

function initializeBot() {
  try {
    bot = getZaloBot();
    setupBotHandlers(bot);
    logger.info('Bot initialized successfully');
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

  // Add your API routes here, e.g.:
  // app.use(`${bp}/api/example`, require('./routes/example'));

  app.use(`${bp}/api/zalo`, setupWebhookRoutes(bot));

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
    initializeBot();
    setupRoutes();

    const server = app.listen(port, async () => {
      logger.info(`Server running on port ${port}`);
      logger.info(`Time: ${new Date().toLocaleString('vi-VN')}`);

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
