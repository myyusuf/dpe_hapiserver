const express = require('express');
const ProjectTypeController = require('../controllers/project_types.js');

const router = express.Router();

router.get('/', ProjectTypeController.findAll);

module.exports = router;
