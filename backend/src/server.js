const http = require('http');
const { createApp } = require('./app');
const { getPort } = require('./config');
const mongo = require('./lib/mongo');

async function start() {
  // Ensure Mongo is reachable before starting to accept traffic
  await mongo.getDb();

  const app = createApp();
  const server = http.createServer(app);

  const port = getPort();

  server.listen(port, () => {
    console.log(`Northstar backend listening on port ${port}`);
  });

  const shutdown = async () => {
    await new Promise((resolve) => server.close(resolve));
    await mongo.close();
  };

  const handleSignal = async () => {
    try {
      await shutdown();
    } finally {
      process.exit(0);
    }
  };

  process.once('SIGINT', handleSignal);
  process.once('SIGTERM', handleSignal);
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});