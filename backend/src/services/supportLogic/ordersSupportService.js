const ordersRepository = require('../../repositories/ordersRepository');

async function getOrderStatus(orderId) {
  const order = await ordersRepository.findByOrderId(orderId);

  if (!order) {
    return null;
  }

  return {
    orderId: order.orderId,
    status: order.status,
    shipmentStatus: order.shipmentStatus,
    expectedDelivery: order.expectedDelivery,
  };
}

module.exports = { getOrderStatus };