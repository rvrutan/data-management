const { Sequelize } = require('sequelize');
const data = require('./genereso_data.json');
const { Project, Asset, Company, Commodity, Geolocation, Production } = require('../models');
const { sequelize, initializeDatabase } = require('../config/database');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Initialize database
    await initializeDatabase();
    
    // Force sync the database to recreate tables
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Insert all projects
    for (const projectData of data) {
      // Map the data to match our new structure
      const project = await Project.create({
        project_name_title: projectData.projectNameTitle,
        asset_type: projectData.assetType,
        work_type: projectData.workType,
        development_status: projectData.developmentStatus,
        location: projectData.location,
        mine_technology: projectData.mineTechnology,
        processing_technology: projectData.processingTechnology,
        country: projectData.country
      });

      // Create Assets
      if (projectData.assetsInMineComplex && Array.isArray(projectData.assetsInMineComplex)) {
        for (const asset of projectData.assetsInMineComplex) {
          await Asset.create({
            project_id: project.project_id,
            asset: asset.asset,
            asset_type: asset.assetType,
            status: asset.status
          });
        }
      }

      // Create Company
      if (projectData.company) {
        await Company.create({
          project_id: project.project_id,
          company: projectData.company,
          company_type: projectData.companyType,
          ownership: projectData.ownership,
          optioned: projectData.optioned
        });
      }

      // Create Commodities
      if (projectData.commodities) {
        await Commodity.create({
          project_id: project.project_id,
          commodity: projectData.commodities,
          primary_commodity: projectData.primaryCommodities
        });
      }

      // Create Geolocation
      if (projectData.lat || projectData.long || projectData.nearestLandmark) {
        await Geolocation.create({
          project_id: project.project_id,
          lat: projectData.lat,
          long: projectData.long,
          nearest_landmark: projectData.nearestLandmark
        });
      }

      // Create Production (if you have production data)
      if (projectData.production) {
        await Production.create({
          project_id: project.project_id,
          ...projectData.production
        });
      }

      console.log(`Created project and related data: ${project.project_name_title}`);
    }

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('Seeding completed. You can now use the API.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }); 