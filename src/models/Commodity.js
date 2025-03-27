const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Commodity = sequelize.define('Commodity', {
  commodity_id: {
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
  commodity: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  primary_commodity: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Commodities',
  timestamps: false
});

module.exports = Commodity; 