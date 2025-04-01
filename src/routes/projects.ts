import { Router } from 'express';
import  AppDataSource  from '../db/dataSource';
import { Project } from '../entities/project';
import { Company } from '../entities/company';
import { Asset } from '../entities/asset';
import { Commodity } from '../entities/commodity';
import { Geolocation } from '../entities/geolocation';
import { Production } from '../entities/production';
import { json2csv } from 'json-2-csv';

const router = Router();

router.post('/', async (req, res) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const companyRepository = AppDataSource.getRepository(Company);

  try {
    // Start a transaction
    await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      // Check if company exists or create new one
      let company = await companyRepository.findOne({
        where: { name: req.body.company.name }
      });

      if (!company) {
        company = companyRepository.create({
          name: req.body.company.name,
          type: req.body.company.type,
          ownership: req.body.company.ownership,
          optioned: req.body.company.optioned
        });
        company = await transactionalEntityManager.save(company);
      }

      // Check if project exists
      let project = await projectRepository.findOne({
        where: { projectNameTitle: req.body.projectNameTitle },
        relations: ['company', 'assets', 'commodities', 'geolocation', 'production']
      });

      if (project) {
        // Update existing project
        project = projectRepository.merge(project, {
          ...req.body,
          company,
          companyId: company.id
        });
      } else {
        // Create new project
        project = projectRepository.create({
          projectNameTitle: req.body.projectNameTitle,
          company,
          companyId: company.id,
          assetType: req.body.assetType,
          workType: req.body.workType,
          developmentStatus: req.body.developmentStatus,
          location: req.body.location,
          country: req.body.country,
          mineTechnology: req.body.mineTechnology,
          processingTechnology: req.body.processingTechnology
        });
      }

      project = await transactionalEntityManager.save(project);

      // Handle assets
      if (req.body.assets) {
        const assetRepository = AppDataSource.getRepository(Asset);
        if (project.assets) {
          await transactionalEntityManager.remove(project.assets);
        }
        const assets = req.body.assets.map((asset: Partial<Asset>) => 
          assetRepository.create({
            ...asset,
            project,
            projectId: project.id
          })
        );
        await transactionalEntityManager.save(assets);
      }

      // Handle commodities
      if (req.body.commodities) {
        const commodityRepository = AppDataSource.getRepository(Commodity);
        if (project.commodities) {
          await transactionalEntityManager.remove(project.commodities);
        }
        const commodities = req.body.commodities.map((commodity: Partial<Commodity>) => 
          commodityRepository.create({
            ...commodity,
            project,
            projectId: project.id
          })
        );
        await transactionalEntityManager.save(commodities);
      }

      // Handle geolocation
      if (req.body.geolocation) {
        const geolocationRepository = AppDataSource.getRepository(Geolocation);
        if (project.geolocation) {
          await transactionalEntityManager.remove(project.geolocation);
        }
        const geolocation = geolocationRepository.create({
          ...req.body.geolocation,
          project,
          projectId: project.id
        });
        await transactionalEntityManager.save(geolocation);
      }

      // Handle production
      if (req.body.production) {
        const productionRepository = AppDataSource.getRepository(Production);
        if (project.production) {
          await transactionalEntityManager.remove(project.production);
        }
        const production = productionRepository.create({
          ...req.body.production,
          project,
          projectId: project.id
        });
        await transactionalEntityManager.save(production);
      }

      res.status(201).json(project);
    });
  } catch (error) {
    console.error('Error creating/updating project:', error);
    res.status(500).json({ error: 'Failed to create/update project' });
  }
});

router.get('/csv', async (req, res) => {
  try {
    const projects = await AppDataSource.getRepository(Project).find({
      relations: ['company', 'assets', 'commodities', 'geolocation', 'production']
    });

    // Transform data for CSV
    const flattenedData = projects.map(project => ({
      projectId: project.id,
      projectName: project.projectNameTitle,
      assetType: project.assetType,
      workType: project.workType,
      developmentStatus: project.developmentStatus,
      location: project.location,
      country: project.country,
      mineTechnology: project.mineTechnology,
      processingTechnology: project.processingTechnology,
      companyName: project.company?.name,
      companyType: project.company?.type,
      companyOwnership: project.company?.ownership,
      companyOptioned: project.company?.optioned,
      latitude: project.geolocation?.lat,
      longitude: project.geolocation?.long,
      nearestLandmark: project.geolocation?.nearestLandmark,
      cobaltKt: project.production?.cobaltKt,
      copperKt: project.production?.copperKt,
      nickelKt: project.production?.nickelKt,
      goldOz: project.production?.goldOz,
      palladiumOz: project.production?.palladiumOz,
      platinumOz: project.production?.platinumOz,
      silverOz: project.production?.silverOz,
      assets: project.assets?.map(a => a.name).join(';'),
      commodities: project.commodities?.map(c => c.name).join(';')
    }));

    const csv = await json2csv(flattenedData);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=projects.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
});

export default router;