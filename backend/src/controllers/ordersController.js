const supportLogic = require('../services/supportLogicInterface');

async function getOrder(req, res, next) {
  try {
    const { orderId: rawOrderId } = req.params;
    const orderId = (rawOrderId || '').trim().toUpperCase();

    // Basic validation: expect a non-empty orderId (pattern like NS-1001)
    if (!orderId || !/^NS-\d+$/.test(orderId)) {
      return res.status(400).json({ error: 'Invalid orderId', orderId: rawOrderId });
    }

    const result = await supportLogic.getOrderStatus(orderId);

    if (!result) {
      return res.status(404).json({ error: 'Not found', orderId });
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getOrder };
