const express = require('express');
const PiutangController = require('../controllers/piutang.js');

const router = express.Router();

router.get('/', PiutangController.findAll);

module.exports = router;
