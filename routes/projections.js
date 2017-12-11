const express = require('express');
const ProjectionController = require('../controllers/projection.js');

const router = express.Router();

router.get('/', ProjectionController.findAll);

module.exports = router;
