const express = require('express');
const CashFlowController = require('../controllers/cash_flow.js');

const router = express.Router();

router.post('/', CashFlowController.fileUpload);

module.exports = router;
