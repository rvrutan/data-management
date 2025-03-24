const sequelize = require('./config/database');
const { Project, Asset, Company, Commodity, Geolocation, Production } = require('./models');
const fs = require('fs');
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.post('/api/projects', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    
    // Create project
    const project = await Project.create({
      projectNameTitle: req.body.projectNameTitle,
      assetType: req.body.assetType,
      workType: req.body.workType,
      developmentStatus: req.body.developmentStatus,
      location: req.body.location,
      nearestLandmark: req.body.nearestLandmark,
      mineTechnology: req.body.mineTechnology,
      processingTechnology: req.body.processingTechnology,
      country: req.body.country
    }, { transaction: t });

    console.log('Created project:', project.toJSON());

    // Handle assets
    if (req.body.assetsInMineComplex) {
      console.log('Processing assets:', req.body.assetsInMineComplex);
      const assets = Array.isArray(req.body.assetsInMineComplex) 
        ? req.body.assetsInMineComplex 
        : Object.entries(req.body.assetsInMineComplex).map(([asset, details]) => ({
            asset,
            assetType: details.assetType,
            status: details.status
          }));

      if (assets.length > 0) {
        const createdAssets = await Asset.bulkCreate(
          assets.map(asset => ({ ...asset, project_id: project.project_id })),
          { transaction: t }
        );
        console.log('Created assets:', createdAssets.map(a => a.toJSON()));
      }
    }

    // Handle companies
    const companies = [];
    if (req.body.company) {
      companies.push({
        company: req.body.company,
        companyType: req.body.companyType,
        ownership: req.body.ownership,
        optioned: req.body.optioned,
        country: req.body.country
      });
    }
    if (req.body.ownershipAndOptions) {
      if (Array.isArray(req.body.ownershipAndOptions)) {
        companies.push(...req.body.ownershipAndOptions.filter(company => company && company.company));
      } else if (typeof req.body.ownershipAndOptions === 'object') {
        Object.values(req.body.ownershipAndOptions).forEach(company => {
          if (company && company.company) {
            companies.push(company);
          }
        });
      }
    }

    if (companies.length > 0) {
      console.log('Processing companies:', companies);
      const createdCompanies = await Company.bulkCreate(
        companies.map(company => ({ ...company, project_id: project.project_id })),
        { transaction: t }
      );
      console.log('Created companies:', createdCompanies.map(c => c.toJSON()));
    }

    // Handle commodities
    if (req.body.commodities || req.body.primaryCommodities) {
      console.log('Processing commodities:', { commodities: req.body.commodities, primaryCommodities: req.body.primaryCommodities });
      const commodity = await Commodity.create({
        project_id: project.project_id,
        commodities: req.body.commodities,
        primaryCommodities: req.body.primaryCommodities || (req.body.nickel && req.body.nickel.primaryCommodities)
      }, { transaction: t });
      console.log('Created commodity:', commodity.toJSON());
    }

    // Handle geolocation
    if (req.body.lat && req.body.long) {
      console.log('Processing geolocation:', { lat: req.body.lat, long: req.body.long });
      const geolocation = await Geolocation.create({
        project_id: project.project_id,
        lat: req.body.lat,
        long: req.body.long,
        nearestLandmark: req.body.nearestLandmark
      }, { transaction: t });
      console.log('Created geolocation:', geolocation.toJSON());
    }

    // Handle production
    const productionData = {};
    if (req.body.cobalt && req.body.cobalt.kt) productionData.cobalt_kt = req.body.cobalt.kt;
    if (req.body.copper && req.body.copper.kt) productionData.copper_kt = req.body.copper.kt;
    if (req.body.nickel && req.body.nickel.kt) productionData.nickel_kt = req.body.nickel.kt;
    if (req.body.gold && req.body.gold.kt) productionData.gold_oz = req.body.gold.kt;
    if (req.body.palladium && req.body.palladium.kt) productionData.palladium_oz = req.body.palladium.kt;
    if (req.body.platinum && req.body.platinum.kt) productionData.platinum_oz = req.body.platinum.kt;
    if (req.body.silver && req.body.silver.kt) productionData.silver_oz = req.body.silver.kt;

    if (Object.keys(productionData).length > 0) {
      console.log('Processing production:', productionData);
      const production = await Production.create({
        ...productionData,
        project_id: project.project_id
      }, { transaction: t });
      console.log('Created production:', production.toJSON());
    }

    // Commit the transaction
    await t.commit();

    // Fetch the complete project with all associations
    const completeProject = await Project.findByPk(project.project_id, {
      include: [
        { model: Asset },
        { model: Company },
        { model: Commodity },
        { model: Geolocation },
        { model: Production }
      ]
    });

    console.log('Complete project with associations:', JSON.stringify(completeProject.toJSON(), null, 2));
    res.status(201).json(completeProject);
  } catch (error) {
    // Rollback the transaction if there's an error
    await t.rollback();
    console.error('Error in POST /api/projects:', error);
    res.status(400).json({ error: error.message });
  }
});

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
    res.status(500).json({ error: error.message });
  }
});

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
    res.status(500).json({ error: error.message });
  }
});

async function clearDatabase() {
  try {
    // Drop all tables in the correct order (respecting foreign key constraints)
    await Production.destroy({ where: {}, force: true });
    await Geolocation.destroy({ where: {}, force: true });
    await Commodity.destroy({ where: {}, force: true });
    await Company.destroy({ where: {}, force: true });
    await Asset.destroy({ where: {}, force: true });
    await Project.destroy({ where: {}, force: true });
    
    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}

async function checkData() {
  try {
    // Read the JSON file
    const jsonData = JSON.parse(fs.readFileSync('./genereso.pdf_data.json', 'utf8'));
    
    // Basic validation
    if (!Array.isArray(jsonData)) {
      throw new Error('Data must be an array');
    }

    // Check each project's required fields
    jsonData.forEach((project, index) => {
      if (!project.projectNameTitle) {
        console.warn(`Warning: Project at index ${index} is missing projectNameTitle`);
      }
      if (!project.assetType) {
        console.warn(`Warning: Project at index ${index} is missing assetType`);
      }
      if (!project.workType) {
        console.warn(`Warning: Project at index ${index} is missing workType`);
      }
    });

    console.log('Data validation completed successfully!');
    return jsonData;
  } catch (error) {
    console.error('Error checking data:', error);
    throw error;
  }
}

async function seedDatabase(jsonData) {
  try {
    // Start a transaction
    const t = await sequelize.transaction();

    try {
      // Process each project in the JSON data
      for (const data of jsonData) {
        // Create project
        const project = await Project.create({
          projectNameTitle: data.projectNameTitle,
          assetType: data.assetType,
          workType: data.workType || 'Unknown', // Provide default value for missing workType
          developmentStatus: data.developmentStatus,
          location: data.location,
          nearestLandmark: data.nearestLandmark,
          mineTechnology: data.mineTechnology,
          processingTechnology: data.processingTechnology,
          country: data.country || (data.ownershipAndOptions && data.ownershipAndOptions.country)
        }, { transaction: t });

        // Handle assets
        if (data.assetsInMineComplex) {
          const assets = Array.isArray(data.assetsInMineComplex) 
            ? data.assetsInMineComplex 
            : Object.entries(data.assetsInMineComplex).map(([asset, details]) => ({
                asset,
                assetType: details.assetType,
                status: details.status
              }));

          if (assets.length > 0) {
            await Asset.bulkCreate(
              assets.map(asset => ({ ...asset, project_id: project.project_id })),
              { transaction: t }
            );
          }
        }

        // Handle companies
        const companies = [];
        if (data.company) {
          companies.push({
            company: data.company,
            companyType: data.companyType,
            ownership: data.ownership,
            optioned: data.optioned,
            country: data.country
          });
        }
        if (data.ownershipAndOptions) {
          if (Array.isArray(data.ownershipAndOptions)) {
            companies.push(...data.ownershipAndOptions.filter(company => company && company.company));
          } else if (typeof data.ownershipAndOptions === 'object') {
            Object.values(data.ownershipAndOptions).forEach(company => {
              if (company && company.company) {
                companies.push(company);
              }
            });
          }
        }

        if (companies.length > 0) {
          await Company.bulkCreate(
            companies.map(company => ({ ...company, project_id: project.project_id })),
            { transaction: t }
          );
        }

        // Handle commodities
        if (data.commodities || data.primaryCommodities) {
          await Commodity.create({
            project_id: project.project_id,
            commodities: data.commodities,
            primaryCommodities: data.primaryCommodities || (data.nickel && data.nickel.primaryCommodities)
          }, { transaction: t });
        }

        // Handle geolocation
        if (data.lat && data.long) {
          await Geolocation.create({
            project_id: project.project_id,
            lat: data.lat,
            long: data.long,
            nearestLandmark: data.nearestLandmark
          }, { transaction: t });
        }

        // Handle production
        const productionData = {};
        if (data.cobalt && data.cobalt.kt) productionData.cobalt_kt = data.cobalt.kt;
        if (data.copper && data.copper.kt) productionData.copper_kt = data.copper.kt;
        if (data.nickel && data.nickel.kt) productionData.nickel_kt = data.nickel.kt;
        if (data.gold && data.gold.kt) productionData.gold_oz = data.gold.kt;
        if (data.palladium && data.palladium.kt) productionData.palladium_oz = data.palladium.kt;
        if (data.platinum && data.platinum.kt) productionData.platinum_oz = data.platinum.kt;
        if (data.silver && data.silver.kt) productionData.silver_oz = data.silver.kt;

        if (Object.keys(productionData).length > 0) {
          await Production.create({
            ...productionData,
            project_id: project.project_id
          }, { transaction: t });
        }
      }

      // Commit the transaction
      await t.commit();
      console.log('Database seeded successfully!');
    } catch (error) {
      // Rollback the transaction if there's an error
      await t.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

async function startServer() {
  try {
    const startPort = process.env.PORT || 3000;
    let currentPort = startPort;
    
    const tryStartServer = async (port) => {
      return new Promise((resolve, reject) => {
        const server = app.listen(port)
          .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              console.log(`Port ${port} is busy, trying ${port + 1}...`);
              server.close();
              resolve(tryStartServer(port + 1));
            } else {
              reject(err);
            }
          })
          .on('listening', () => {
            console.log(`Server is running on port ${port}`);
            resolve(server);
          });
      });
    };

    await tryStartServer(currentPort);
  } catch (error) {
    console.error('Error starting server:', error);
    throw error;
  }
}

async function setup() {
  try {
    console.log('Starting setup process...');
    
    // Initialize database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: true });
    console.log('Database synchronized.');
    
    // Step 1: Clear the database
    await clearDatabase();
    
    // Step 2: Check the data
    const jsonData = await checkData();
    
    // Step 3: Seed the database
    await seedDatabase(jsonData);
    
    // Step 4: Start the server
    await startServer();
    
    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup process
setup(); 