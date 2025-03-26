const { Sequelize } = require('sequelize');
const data = require('./genereso_data.json');
const { Project } = require('../models');
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
    for (const project of data) {
      // Remove MongoDB specific _id
      const projectData = { ...project };
      delete projectData._id;

      await Project.create(projectData);
      console.log(`Created project: ${project.projectNameTitle}`);
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