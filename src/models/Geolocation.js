const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Geolocation = sequelize.define('Geolocation', {
  geolocation_id: {
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
  lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  long: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  nearest_landmark: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Geolocation',
  timestamps: false
});

module.exports = Geolocation; 