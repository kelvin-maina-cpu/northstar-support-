const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// GET /api/orders/:orderId
router.get('/:orderId', ordersController.getOrder);

module.exports = router;
