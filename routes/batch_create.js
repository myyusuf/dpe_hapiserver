const express = require('express');
const ProjectProgressController = require('../controllers/project_progress.js');
const LspController = require('../controllers/lsp.js');
const BadController = require('../controllers/bad.js');
const UmurPiutangController = require('../controllers/piutang.js');
const CashFlowController = require('../controllers/cash_flow.js');
const ProjectionController = require('../controllers/projection.js');

const router = express.Router();

router.post('/projectprogress', ProjectProgressController.batchCreate);
router.post('/lsp', LspController.batchCreate);
router.post('/bad', BadController.batchCreate);
router.post('/umurpiutang', UmurPiutangController.batchCreate);
router.post('/cashflow', CashFlowController.batchCreate);
router.post('/projection', ProjectionController.batchCreate);

module.exports = router;
