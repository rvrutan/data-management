const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    allowNull: true
  },
  copper_kt: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  nickel_kt: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  gold_oz: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  palladium_oz: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  platinum_oz: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  silver_oz: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: 'Production',
  timestamps: false
});

module.exports = Production; 