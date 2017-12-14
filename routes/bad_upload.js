const express = require('express');
const BadController = require('../controllers/bad.js');

const router = express.Router();

router.post('/', BadController.fileUpload);

module.exports = router;
