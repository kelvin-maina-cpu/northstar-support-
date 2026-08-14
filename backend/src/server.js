const http = require('http');
const { MongoClient } = require('mongodb');
const { createApp } = require('./app');
const { getDatabaseName, getMongoUri, getPort } = require('./config');

async function start() {
  const client = new MongoClient(getMongoUri());
  await client.connect();

  const db = client.db(getDatabaseName());
  const app = createApp();
  const server = http.createServer(app);

  const port = getPort();

  server.listen(port, () => {
    console.log(`Northstar backend listening on port ${port}`);
  });

  const shutdown = async () => {
    await new Promise((resolve) => server.close(resolve));
    await client.close();
  };

  process.on('SIGINT', async () => {
    await shutdown();
    process.exit(0);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});