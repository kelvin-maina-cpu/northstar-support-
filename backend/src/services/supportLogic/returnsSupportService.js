const ordersRepository = require('../../repositories/ordersRepository');
const returnsRepository = require('../../repositories/returnsRepository');

async function getReturnInfo(orderId) {
  const order = await ordersRepository.findByOrderId(orderId);

  if (!order) {
    return null;
  }

  const returnRecord = await returnsRepository.findByOrderId(orderId);

  if (returnRecord && returnRecord.returnStatus !== 'Rejected') {
    return {
      orderId: order.orderId,
      eligible: true,
      returnStatus: returnRecord.returnStatus,
      refundStatus: returnRecord.refundStatus,
    };
  }

  return {
    orderId: order.orderId,
    eligible: order.status === 'Delivered',
    returnStatus: 'Not Requested',
    refundStatus: null,
  };
}

module.exports = { getReturnInfo };