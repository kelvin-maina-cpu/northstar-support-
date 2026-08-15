const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set. Export it before running this script.');
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const admin = client.db().admin();
    const ping = await admin.ping();
    console.log('Ping response:', ping);
    const buildInfo = await admin.serverStatus();
    console.log('ServerStatus ok:', !!buildInfo.ok);
  } catch (err) {
    console.error('Connect failed:', err);
    process.exitCode = 1;
  } finally {
    try { await client.close(); } catch (e) {}
  }
}

run();
