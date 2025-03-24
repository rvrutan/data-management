const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  projectNameTitle: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  assetType: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  workType: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  developmentStatus: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  nearestLandmark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mineTechnology: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  processingTechnology: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  country: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Projects',
  timestamps: false
});

module.exports = Project; 