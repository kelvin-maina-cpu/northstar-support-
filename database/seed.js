/**
 * database/seed.js
 * Seeds the MongoDB database with fixture data for local development and demos.
 * Matches the stack agreed in docs/architecture.md (Node.js + Express + MongoDB).
 *
 * Usage:
 *   MONGODB_URI="mongodb://localhost:27017" node database/seed.js
 *   (defaults to mongodb://localhost:27017 if MONGODB_URI is unset)
 *
 * Requires the `mongodb` package (npm install mongodb) once the backend
 * project's package.json exists — not added here since there's no
 * package.json in the repo yet for this script to live under.
 */
const { MongoClient } = require("mongodb");
const path = require("path");
const { orders, returns } = require(path.join(__dirname, "sample-data.json"));

async function seed() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("northstar");

    await db.collection("orders").deleteMany({});
    await db.collection("returns").deleteMany({});

    await db.collection("orders").insertMany(orders);
    await db.collection("returns").insertMany(returns);

    // orderId is the business key the frontend/API actually queries by —
    // unique + indexed so lookups stay fast without a full collection scan.
    await db.collection("orders").createIndex({ orderId: 1 }, { unique: true });
    await db.collection("returns").createIndex({ orderId: 1 });

    console.log(`Seeded ${orders.length} orders and ${returns.length} returns into "northstar" database.`);
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
