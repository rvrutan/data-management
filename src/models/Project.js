const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  projectNameTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  assetType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  workType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  developmentStatus: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  long: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  nearestLandmark: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mineTechnology: {
    type: DataTypes.STRING,
    allowNull: true
  },
  processingTechnology: {
    type: DataTypes.STRING,
    allowNull: true
  },
  commodities: {
    type: DataTypes.STRING,
    allowNull: true
  },
  primaryCommodities: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assetsInMineComplex: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ownership: {
    type: DataTypes.STRING,
    allowNull: true
  },
  optioned: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Projects',
  timestamps: false
});

module.exports = Project; 