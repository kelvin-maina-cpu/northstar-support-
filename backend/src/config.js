/**
 * config.js
 * Configuration for the backend.
 */

function getMongoUri() {
  return process.env.MONGODB_URI || 'mongodb://localhost:27017';
}

function getDatabaseName() {
  return process.env.DB_NAME || 'northstar';
}

function getPort() {
  return parseInt(process.env.PORT || '3000', 10);
}

module.exports = { getMongoUri, getDatabaseName, getPort };
