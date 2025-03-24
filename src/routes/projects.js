const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { validateProjectData, validateQueryParams } = require('../middleware/validate');

// Project routes
router.post('/', validateProjectData, projectController.createProject);
router.get('/', validateQueryParams, projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', validateProjectData, projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router; 