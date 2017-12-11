const express = require('express');
const ProjectionController = require('../controllers/projection.js');

const router = express.Router();

router.post('/', ProjectionController.fileUpload);

module.exports = router;
