const express = require('express');
const router = express.Router();
const returnsController = require('../controllers/returnsController');

// GET /api/returns/:orderId
router.get('/:orderId', returnsController.getReturnInfo);

module.exports = router;
