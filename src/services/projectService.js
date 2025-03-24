const { Project, Asset, Company, Commodity, Geolocation, Production } = require('../models');
const logger = require('../utils/logger');

class ProjectService {
  async createProject(projectData) {
    const t = await sequelize.transaction();
    
    try {
      logger.info('Creating project with data:', projectData);
      
      // Create project
      const project = await Project.create({
        projectNameTitle: projectData.projectNameTitle,
        assetType: projectData.assetType,
        workType: projectData.workType,
        developmentStatus: projectData.developmentStatus,
        location: projectData.location,
        nearestLandmark: projectData.nearestLandmark,
        mineTechnology: projectData.mineTechnology,
        processingTechnology: projectData.processingTechnology,
        country: projectData.country
      }, { transaction: t });

      // Handle assets
      if (projectData.assetsInMineComplex) {
        const assets = Array.isArray(projectData.assetsInMineComplex) 
          ? projectData.assetsInMineComplex 
          : Object.entries(projectData.assetsInMineComplex).map(([asset, details]) => ({
              asset,
              assetType: details.assetType,
              status: details.status
            }));

        if (assets.length > 0) {
          await Asset.bulkCreate(
            assets.map(asset => ({ ...asset, project_id: project.project_id })),
            { transaction: t }
          );
        }
      }

      // Handle companies
      const companies = [];
      if (projectData.company) {
        companies.push({
          company: projectData.company,
          companyType: projectData.companyType,
          ownership: projectData.ownership,
          optioned: projectData.optioned,
          country: projectData.country
        });
      }
      if (projectData.ownershipAndOptions) {
        if (Array.isArray(projectData.ownershipAndOptions)) {
          companies.push(...projectData.ownershipAndOptions.filter(company => company && company.company));
        } else if (typeof projectData.ownershipAndOptions === 'object') {
          Object.values(projectData.ownershipAndOptions).forEach(company => {
            if (company && company.company) {
              companies.push(company);
            }
          });
        }
      }

      if (companies.length > 0) {
        await Company.bulkCreate(
          companies.map(company => ({ ...company, project_id: project.project_id })),
          { transaction: t }
        );
      }

      // Handle commodities
      if (projectData.commodities || projectData.primaryCommodities) {
        await Commodity.create({
          project_id: project.project_id,
          commodities: projectData.commodities,
          primaryCommodities: projectData.primaryCommodities || (projectData.nickel && projectData.nickel.primaryCommodities)
        }, { transaction: t });
      }

      // Handle geolocation
      if (projectData.lat && projectData.long) {
        await Geolocation.create({
          project_id: project.project_id,
          lat: projectData.lat,
          long: projectData.long,
          nearestLandmark: projectData.nearestLandmark
        }, { transaction: t });
      }

      // Handle production
      const productionData = {};
      if (projectData.cobalt && projectData.cobalt.kt) productionData.cobalt_kt = projectData.cobalt.kt;
      if (projectData.copper && projectData.copper.kt) productionData.copper_kt = projectData.copper.kt;
      if (projectData.nickel && projectData.nickel.kt) productionData.nickel_kt = projectData.nickel.kt;
      if (projectData.gold && projectData.gold.kt) productionData.gold_oz = projectData.gold.kt;
      if (projectData.palladium && projectData.palladium.kt) productionData.palladium_oz = projectData.palladium.kt;
      if (projectData.platinum && projectData.platinum.kt) productionData.platinum_oz = projectData.platinum.kt;
      if (projectData.silver && projectData.silver.kt) productionData.silver_oz = projectData.silver.kt;

      if (Object.keys(productionData).length > 0) {
        await Production.create({
          ...productionData,
          project_id: project.project_id
        }, { transaction: t });
      }

      await t.commit();

      // Fetch the complete project with all associations
      const completeProject = await Project.findByPk(project.project_id, {
        include: [
          { model: Asset },
          { model: Company },
          { model: Commodity },
          { model: Geolocation },
          { model: Production }
        ]
      });

      return completeProject;
    } catch (error) {
      await t.rollback();
      logger.error('Error creating project:', error);
      throw error;
    }
  }

  async getAllProjects(query = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        country,
        assetType,
        workType,
        developmentStatus
      } = query;

      const offset = (page - 1) * limit;

      // Build where clause for filtering
      const where = {};
      if (country) where.country = country;
      if (assetType) where.assetType = assetType;
      if (workType) where.workType = workType;
      if (developmentStatus) where.developmentStatus = developmentStatus;

      // Get total count for pagination
      const total = await Project.count({ where });

      // Get paginated results
      const projects = await Project.findAll({
        where,
        include: [
          { model: Asset },
          { model: Company },
          { model: Commodity },
          { model: Geolocation },
          { model: Production }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['project_id', 'DESC']]
      });

      return {
        projects,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getProjectById(id) {
    try {
      const project = await Project.findByPk(id, {
        include: [
          { model: Asset },
          { model: Company },
          { model: Commodity },
          { model: Geolocation },
          { model: Production }
        ]
      });
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      return project;
    } catch (error) {
      logger.error('Error fetching project:', error);
      throw error;
    }
  }

  async updateProject(id, projectData) {
    const t = await sequelize.transaction();
    
    try {
      logger.info(`Updating project ${id} with data:`, projectData);
      
      // Find the project
      const project = await Project.findByPk(id);
      if (!project) {
        throw new Error('Project not found');
      }

      // Update project
      await project.update({
        projectNameTitle: projectData.projectNameTitle,
        assetType: projectData.assetType,
        workType: projectData.workType,
        developmentStatus: projectData.developmentStatus,
        location: projectData.location,
        nearestLandmark: projectData.nearestLandmark,
        mineTechnology: projectData.mineTechnology,
        processingTechnology: projectData.processingTechnology,
        country: projectData.country
      }, { transaction: t });

      // Handle assets
      if (projectData.assetsInMineComplex) {
        // Delete existing assets
        await Asset.destroy({ where: { project_id: id }, transaction: t });

        const assets = Array.isArray(projectData.assetsInMineComplex) 
          ? projectData.assetsInMineComplex 
          : Object.entries(projectData.assetsInMineComplex).map(([asset, details]) => ({
              asset,
              assetType: details.assetType,
              status: details.status
            }));

        if (assets.length > 0) {
          await Asset.bulkCreate(
            assets.map(asset => ({ ...asset, project_id: id })),
            { transaction: t }
          );
        }
      }

      // Handle companies
      if (projectData.company || projectData.ownershipAndOptions) {
        // Delete existing companies
        await Company.destroy({ where: { project_id: id }, transaction: t });

        const companies = [];
        if (projectData.company) {
          companies.push({
            company: projectData.company,
            companyType: projectData.companyType,
            ownership: projectData.ownership,
            optioned: projectData.optioned,
            country: projectData.country
          });
        }
        if (projectData.ownershipAndOptions) {
          if (Array.isArray(projectData.ownershipAndOptions)) {
            companies.push(...projectData.ownershipAndOptions.filter(company => company && company.company));
          } else if (typeof projectData.ownershipAndOptions === 'object') {
            Object.values(projectData.ownershipAndOptions).forEach(company => {
              if (company && company.company) {
                companies.push(company);
              }
            });
          }
        }

        if (companies.length > 0) {
          await Company.bulkCreate(
            companies.map(company => ({ ...company, project_id: id })),
            { transaction: t }
          );
        }
      }

      // Handle commodities
      if (projectData.commodities || projectData.primaryCommodities) {
        // Delete existing commodity
        await Commodity.destroy({ where: { project_id: id }, transaction: t });

        await Commodity.create({
          project_id: id,
          commodities: projectData.commodities,
          primaryCommodities: projectData.primaryCommodities || (projectData.nickel && projectData.nickel.primaryCommodities)
        }, { transaction: t });
      }

      // Handle geolocation
      if (projectData.lat && projectData.long) {
        // Delete existing geolocation
        await Geolocation.destroy({ where: { project_id: id }, transaction: t });

        await Geolocation.create({
          project_id: id,
          lat: projectData.lat,
          long: projectData.long,
          nearestLandmark: projectData.nearestLandmark
        }, { transaction: t });
      }

      // Handle production
      if (projectData.cobalt || projectData.copper || projectData.nickel || 
          projectData.gold || projectData.palladium || projectData.platinum || 
          projectData.silver) {
        // Delete existing production
        await Production.destroy({ where: { project_id: id }, transaction: t });

        const productionData = {};
        if (projectData.cobalt && projectData.cobalt.kt) productionData.cobalt_kt = projectData.cobalt.kt;
        if (projectData.copper && projectData.copper.kt) productionData.copper_kt = projectData.copper.kt;
        if (projectData.nickel && projectData.nickel.kt) productionData.nickel_kt = projectData.nickel.kt;
        if (projectData.gold && projectData.gold.kt) productionData.gold_oz = projectData.gold.kt;
        if (projectData.palladium && projectData.palladium.kt) productionData.palladium_oz = projectData.palladium.kt;
        if (projectData.platinum && projectData.platinum.kt) productionData.platinum_oz = projectData.platinum.kt;
        if (projectData.silver && projectData.silver.kt) productionData.silver_oz = projectData.silver.kt;

        if (Object.keys(productionData).length > 0) {
          await Production.create({
            ...productionData,
            project_id: id
          }, { transaction: t });
        }
      }

      await t.commit();

      // Fetch the updated project with all associations
      const updatedProject = await Project.findByPk(id, {
        include: [
          { model: Asset },
          { model: Company },
          { model: Commodity },
          { model: Geolocation },
          { model: Production }
        ]
      });

      return updatedProject;
    } catch (error) {
      await t.rollback();
      logger.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id) {
    const t = await sequelize.transaction();
    
    try {
      logger.info(`Deleting project ${id}`);
      
      // Find the project
      const project = await Project.findByPk(id);
      if (!project) {
        throw new Error('Project not found');
      }

      // Delete all associated records
      await Asset.destroy({ where: { project_id: id }, transaction: t });
      await Company.destroy({ where: { project_id: id }, transaction: t });
      await Commodity.destroy({ where: { project_id: id }, transaction: t });
      await Geolocation.destroy({ where: { project_id: id }, transaction: t });
      await Production.destroy({ where: { project_id: id }, transaction: t });
      
      // Delete the project
      await project.destroy({ transaction: t });

      await t.commit();
      logger.info(`Successfully deleted project ${id}`);
      return true;
    } catch (error) {
      await t.rollback();
      logger.error('Error deleting project:', error);
      throw error;
    }
  }
}

module.exports = new ProjectService(); 