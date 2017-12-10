const express = require('express');
const ProjectProgressController = require('../controllers/project_progress.js');

const router = express.Router();

router.post('/', ProjectProgressController.fileUpload);

module.exports = router;
