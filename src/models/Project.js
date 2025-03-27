const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_name_title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  asset_type: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  work_type: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  development_status: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mine_technology: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  processing_technology: {
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