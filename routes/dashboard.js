const express = require('express');
const DashboardController = require('../controllers/dashboard.js');

const router = express.Router();

router.get('/data/:year/:month', DashboardController.getDashboardData);
router.get('/charts/:year', DashboardController.allCharts);

module.exports = router;
