/*
 backend/run-seed.js
 Simple wrapper to seed the database using the fixtures in ../database/sample-data.json
 This runs from the `backend` folder so it can reuse the backend/node_modules (mongodb).

 Usage (PowerShell):
 $env:MONGODB_URI = '<your-uri>'
 node run-seed.js
*/

const { MongoClient } = require('mongodb');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'database', 'sample-data.json');
const { orders, returns } = require(dataPath);

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'northstar');

    await db.collection('orders').deleteMany({});
    await db.collection('returns').deleteMany({});

    if (orders && orders.length) await db.collection('orders').insertMany(orders);
    if (returns && returns.length) await db.collection('returns').insertMany(returns);

    await db.collection('orders').createIndex({ orderId: 1 }, { unique: true });
    await db.collection('returns').createIndex({ orderId: 1 });

    console.log(`Seeded ${orders.length} orders and ${returns.length} returns into "${db.databaseName}" database.`);
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
