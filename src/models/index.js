const Project = require('./Project');
const Asset = require('./Asset');
const Company = require('./Company');
const Commodity = require('./Commodity');
const Geolocation = require('./Geolocation');
const Production = require('./Production');

// Define relationships
Project.hasMany(Asset, { foreignKey: 'project_id' });
Asset.belongsTo(Project, { foreignKey: 'project_id' });

Project.hasMany(Company, { foreignKey: 'project_id' });
Company.belongsTo(Project, { foreignKey: 'project_id' });

Project.hasMany(Commodity, { foreignKey: 'project_id' });
Commodity.belongsTo(Project, { foreignKey: 'project_id' });

Project.hasOne(Geolocation, { foreignKey: 'project_id' });
Geolocation.belongsTo(Project, { foreignKey: 'project_id' });

Project.hasOne(Production, { foreignKey: 'project_id' });
Production.belongsTo(Project, { foreignKey: 'project_id' });

module.exports = {
  Project,
  Asset,
  Company,
  Commodity,
  Geolocation,
  Production
}; 