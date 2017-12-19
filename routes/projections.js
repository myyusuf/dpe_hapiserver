const express = require('express');
const ProjectionController = require('../controllers/projection.js');

const router = express.Router();

router.get('/', ProjectionController.findAndCountAll);
router.get('/proyeksi/:year/:month', ProjectionController.findAll);

module.exports = router;
