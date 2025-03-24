const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  company_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'project_id'
    }
  },
  company: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  companyType: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ownership: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  optioned: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Companies',
  timestamps: false
});

module.exports = Company; 