const express = require('express');
const ProjectController = require('../controllers/projects.js');

const router = express.Router();

router.get('/', ProjectController.findAll);
router.get('/:projectId', ProjectController.findOne);
router.post('/', ProjectController.create);
router.put('/:projectId', ProjectController.update);
router.delete('/:projectId', ProjectController.destroy);

module.exports = router;
