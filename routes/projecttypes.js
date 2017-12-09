const express = require('express');
const ProjectTypeController = require('../controllers/projecttypes.js');

const router = express.Router();

router.get('/', ProjectTypeController.findAll);

module.exports = router;
