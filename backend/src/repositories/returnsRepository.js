const { getDb } = require('../lib/mongo');

async function findByOrderId(orderId) {
  const db = await getDb();
  return db.collection('returns').findOne({ orderId });
}

module.exports = { findByOrderId };
