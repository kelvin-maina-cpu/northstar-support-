const { MongoClient } = require('mongodb');

let _client = null;
let _db = null;

async function getDb() {
  if (_db) return _db;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  _client = new MongoClient(uri);
  await _client.connect();
  _db = _client.db('northstar');
  return _db;
}

async function close() {
  if (_client) {
    await _client.close();
    _client = null;
    _db = null;
  }
}

module.exports = { getDb, close };
