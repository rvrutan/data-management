const Joi = require('joi');

const projectSchema = Joi.object({
  projectNameTitle: Joi.string().required(),
  assetType: Joi.string().required(),
  workType: Joi.string().required(),
  developmentStatus: Joi.string().required(),
  location: Joi.string().required(),
  nearestLandmark: Joi.string().allow('', null),
  mineTechnology: Joi.string().allow('', null),
  processingTechnology: Joi.string().allow('', null),
  country: Joi.string().required(),
  assetsInMineComplex: Joi.alternatives().try(
    Joi.array().items(Joi.object({
      asset: Joi.string().required(),
      assetType: Joi.string().required(),
      status: Joi.string().required()
    })),
    Joi.object().pattern(Joi.string(), Joi.object({
      assetType: Joi.string().required(),
      status: Joi.string().required()
    }))
  ),
  company: Joi.string().allow('', null),
  companyType: Joi.string().allow('', null),
  ownership: Joi.string().allow('', null),
  optioned: Joi.string().allow('', null),
  ownershipAndOptions: Joi.alternatives().try(
    Joi.array().items(Joi.object({
      company: Joi.string().required(),
      companyType: Joi.string().allow('', null),
      ownership: Joi.string().allow('', null),
      optioned: Joi.string().allow('', null),
      country: Joi.string().allow('', null)
    })),
    Joi.object().pattern(Joi.string(), Joi.object({
      company: Joi.string().required(),
      companyType: Joi.string().allow('', null),
      ownership: Joi.string().allow('', null),
      optioned: Joi.string().allow('', null),
      country: Joi.string().allow('', null)
    }))
  ),
  commodities: Joi.string().allow('', null),
  primaryCommodities: Joi.string().allow('', null),
  lat: Joi.number().min(-90).max(90).allow('', null),
  long: Joi.number().min(-180).max(180).allow('', null),
  cobalt: Joi.object({
    kt: Joi.number().min(0).allow('', null)
  }),
  copper: Joi.object({
    kt: Joi.number().min(0).allow('', null)
  }),
  nickel: Joi.object({
    kt: Joi.number().min(0).allow('', null),
    primaryCommodities: Joi.string().allow('', null)
  }),
  gold: Joi.object({
    kt: Joi.number().min(0).allow('', null)
  }),
  palladium: Joi.object({
    kt: Joi.number().min(0).allow('', null)
  }),
  platinum: Joi.object({
    kt: Joi.number().min(0).allow('', null)
  }),
  silver: Joi.object({
    kt: Joi.number().min(0).allow('', null)
  })
});

const querySchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  country: Joi.string().allow('', null),
  assetType: Joi.string().allow('', null),
  workType: Joi.string().allow('', null),
  developmentStatus: Joi.string().allow('', null)
});

const validateProject = (data) => {
  return projectSchema.validate(data, { abortEarly: false });
};

const validateQuery = (data) => {
  return querySchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateProject,
  validateQuery
}; 