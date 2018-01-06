const express = require('express');
const ProjectProgressController = require('../controllers/project_progress.js');
const LspController = require('../controllers/lsp.js');
const BadController = require('../controllers/bad.js');

const router = express.Router();

router.post('/projectprogress', ProjectProgressController.batchCreate);
router.post('/lsp', LspController.batchCreate);
router.post('/bad', BadController.batchCreate);

module.exports = router;
