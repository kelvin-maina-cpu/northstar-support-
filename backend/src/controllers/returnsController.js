const supportLogic = require('../services/supportLogicInterface');

async function getReturnInfo(req, res, next) {
  try {
    const { orderId } = req.params;

    if (!orderId || !/^NS-\d+/i.test(orderId)) {
      return res.status(400).json({ error: 'Invalid orderId', orderId });
    }

    const result = await supportLogic.getReturnInfo(orderId);

    if (!result) {
      return res.status(404).json({ error: 'Not found', orderId });
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getReturnInfo };
