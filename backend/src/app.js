/**
 * app.js
 * Express application configuration and middleware setup.
 */

const express = require('express');
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
  app.use(express.json());

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
