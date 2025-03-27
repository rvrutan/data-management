const express = require('express');
const { Project, Asset, Company, Commodity, Geolocation, Production } = require('./models');

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all projects with their related data
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: Asset },
        { model: Company },
        { model: Commodity },
        { model: Geolocation },
        { model: Production }
      ]
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single project with all related data
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: Asset },
        { model: Company },
        { model: Commodity },
        { model: Geolocation },
        { model: Production }
      ]
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all assets
app.get('/api/assets', async (req, res) => {
  try {
    const assets = await Asset.findAll({
      include: [{ model: Project }]
    });
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all companies
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: [{ model: Project }]
    });
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all commodities
app.get('/api/commodities', async (req, res) => {
  try {
    const commodities = await Commodity.findAll({
      include: [{ model: Project }]
    });
    res.json(commodities);
  } catch (error) {
    console.error('Error fetching commodities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all geolocations
app.get('/api/geolocations', async (req, res) => {
  try {
    const geolocations = await Geolocation.findAll({
      include: [{ model: Project }]
    });
    res.json(geolocations);
  } catch (error) {
    console.error('Error fetching geolocations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all production data
app.get('/api/production', async (req, res) => {
  try {
    const production = await Production.findAll({
      include: [{ model: Project }]
    });
    res.json(production);
  } catch (error) {
    console.error('Error fetching production data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new project with related data
app.post('/api/projects', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ error: 'Invalid project data' });
  }
});

// Update an existing project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    await project.update(req.body);
    const updatedProject = await Project.findByPk(req.params.id, {
      include: [
        { model: Asset },
        { model: Company },
        { model: Commodity },
        { model: Geolocation },
        { model: Production }
      ]
    });
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ error: 'Invalid project data' });
  }
});

module.exports = app; 