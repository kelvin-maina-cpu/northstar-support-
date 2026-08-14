/**
 * supportLogicInterface
 *
 * Thin adapter that controllers call. The actual business-rule
 * implementations live under `services/supportLogic/` and are the
 * responsibility of the Support Logic Developer.
 *
 * When a service module is not present, these functions return null so
 * controllers can respond with 404 until the service is implemented.
 */

async function getOrderStatus(orderId) {
  try {
    const svc = require('./supportLogic/ordersSupportService');
    if (svc && typeof svc.getOrderStatus === 'function') {
      return await svc.getOrderStatus(orderId);
    }
  } catch (err) {
    // service not implemented yet — return null to indicate not found
  }
  return null;
}

async function getReturnInfo(orderId) {
  try {
    const svc = require('./supportLogic/returnsSupportService');
    if (svc && typeof svc.getReturnInfo === 'function') {
      return await svc.getReturnInfo(orderId);
    }
  } catch (err) {
    // service not implemented yet
  }
  return null;
}

module.exports = { getOrderStatus, getReturnInfo };
