const express = require('express');
const PiutangController = require('../controllers/piutang.js');

const router = express.Router();

router.post('/', PiutangController.fileUpload);

module.exports = router;
