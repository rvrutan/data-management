const { Project, Asset, Company, Commodity, Geolocation, Production } = require('../models');

const createProject = async (req, res) => {
  const t = await Project.sequelize.transaction();

  try {
    const data = req.body;

    // Create project
    const project = await Project.create({
      projectNameTitle: data.projectNameTitle,
      assetType: data.assetType,
      workType: data.workType,
      developmentStatus: data.developmentStatus,
      location: data.location,
      nearestLandmark: data.nearestLandmark,
      mineTechnology: data.mineTechnology,
      processingTechnology: data.processingTechnology,
      country: data.country || (data.ownershipAndOptions && data.ownershipAndOptions.country)
    }, { transaction: t });

    // Handle assets
    if (data.assetsInMineComplex) {
      const assets = Array.isArray(data.assetsInMineComplex) 
        ? data.assetsInMineComplex 
        : Object.entries(data.assetsInMineComplex).map(([asset, details]) => ({
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
    if (data.company) {
      companies.push({
        company: data.company,
        companyType: data.companyType,
        ownership: data.ownership,
        optioned: data.optioned,
        country: data.country
      });
    }
    if (data.ownershipAndOptions) {
      if (Array.isArray(data.ownershipAndOptions)) {
        companies.push(...data.ownershipAndOptions);
      } else if (typeof data.ownershipAndOptions === 'object') {
        Object.values(data.ownershipAndOptions).forEach(company => {
          if (company.company) {
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
    if (data.commodities || data.primaryCommodities) {
      await Commodity.create({
        project_id: project.project_id,
        commodities: data.commodities,
        primaryCommodities: data.primaryCommodities || (data.nickel && data.nickel.primaryCommodities)
      }, { transaction: t });
    }

    // Handle geolocation
    if (data.lat && data.long) {
      await Geolocation.create({
        project_id: project.project_id,
        lat: data.lat,
        long: data.long,
        nearestLandmark: data.nearestLandmark
      }, { transaction: t });
    }

    // Handle production
    const productionData = {};
    if (data.cobalt && data.cobalt.kt) productionData.cobalt_kt = data.cobalt.kt;
    if (data.copper && data.copper.kt) productionData.copper_kt = data.copper.kt;
    if (data.nickel && data.nickel.kt) productionData.nickel_kt = data.nickel.kt;
    if (data.gold && data.gold.kt) productionData.gold_oz = data.gold.kt;
    if (data.palladium && data.palladium.kt) productionData.palladium_oz = data.palladium.kt;
    if (data.platinum && data.platinum.kt) productionData.platinum_oz = data.platinum.kt;
    if (data.silver && data.silver.kt) productionData.silver_oz = data.silver.kt;

    if (Object.keys(productionData).length > 0) {
      await Production.create({
        ...productionData,
        project_id: project.project_id
      }, { transaction: t });
    }

    await t.commit();

    res.status(201).json({
      message: 'Project and related data created successfully',
      project_id: project.project_id
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating project:', error);
    res.status(500).json({
      error: 'Error creating project',
      details: error.message
    });
  }
};

module.exports = {
  createProject
}; 