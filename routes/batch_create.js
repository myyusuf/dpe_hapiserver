const express = require('express');
const ProjectProgressController = require('../controllers/project_progress.js');

const router = express.Router();

router.post('/projectprogress', ProjectProgressController.batchCreate);

module.exports = router;
