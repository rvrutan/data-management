const projectService = require('../services/projectService');
const logger = require('../utils/logger');

class ProjectController {
  async createProject(req, res) {
    try {
      const project = await projectService.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      logger.error('Error in createProject controller:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getAllProjects(req, res) {
    try {
      const result = await projectService.getAllProjects(req.query);
      res.json(result);
    } catch (error) {
      logger.error('Error in getAllProjects controller:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getProjectById(req, res) {
    try {
      const project = await projectService.getProjectById(req.params.id);
      res.json(project);
    } catch (error) {
      logger.error('Error in getProjectById controller:', error);
      if (error.message === 'Project not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async updateProject(req, res) {
    try {
      const project = await projectService.updateProject(req.params.id, req.body);
      res.json(project);
    } catch (error) {
      logger.error('Error in updateProject controller:', error);
      if (error.message === 'Project not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async deleteProject(req, res) {
    try {
      await projectService.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error in deleteProject controller:', error);
      if (error.message === 'Project not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = new ProjectController(); 