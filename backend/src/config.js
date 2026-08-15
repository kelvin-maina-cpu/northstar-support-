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

function assertProductionConfig() {
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be configured in production.');
  }
}

module.exports = { getMongoUri, getDatabaseName, getPort, assertProductionConfig };
