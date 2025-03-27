const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Production = sequelize.define('Production', {
  production_id: {
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
  cobalt_kt: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  copper_kt: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  nickel_kt: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  gold_oz: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  palladium_oz: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  platinum_oz: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  silver_oz: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'Production',
  timestamps: false
});

module.exports = Production; 