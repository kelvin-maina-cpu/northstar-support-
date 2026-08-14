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
  const servicePath = './supportLogic/ordersSupportService';

  try {
    const svc = require(servicePath);
    if (svc && typeof svc.getOrderStatus === 'function') {
      return await svc.getOrderStatus(orderId);
    }

    throw new Error('ordersSupportService.getOrderStatus is not implemented');
  } catch (err) {
    if (err && err.code === 'MODULE_NOT_FOUND' && String(err.message || '').includes(servicePath)) {
      // service not implemented yet — return null to indicate not found
      return null;
    }
    throw err;
  }
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
