const express = require('express');
const BadController = require('../controllers/bad.js');

const router = express.Router();

router.get('/', BadController.findAll);

module.exports = router;
