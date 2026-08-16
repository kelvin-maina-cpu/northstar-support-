/**
 * app.js
 * Express application configuration and middleware setup.
 */

const express = require('express');
const cors = require('cors');
const ordersRouter = require('./routes/orders');
const returnsRouter = require('./routes/returns');

/**
 * createApp
 * Initializes and returns a configured Express application.
 * Accepts an optional options object for dependency injection (e.g., repositories).
 */
function createApp(options = {}) {
  const app = express();

  // Middleware
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '100kb' }));

  // Set FRONTEND_URL to a comma-separated list when deploying previews or a
  // custom domain in addition to the primary Vercel deployment.
  const configuredOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  // The production frontend remains allowed even when Render has an outdated
  // FRONTEND_URL setting. FRONTEND_URL can add custom domains or previews.
  const allowedOrigins = [...new Set([
    'http://localhost:5173',
    'https://northstar-support-phi.vercel.app',
    ...configuredOrigins,
  ])];
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  }));

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Routes
  app.use('/api/orders', ordersRouter);
  app.use('/api/returns', returnsRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler (must have 4 args for Express to treat it as such)
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
