const express = require('express');
const CashFlowController = require('../controllers/cash_flow.js');

const router = express.Router();

router.get('/', CashFlowController.findAll);
router.get('/all/:year/:month', CashFlowController.findAll);

module.exports = router;
