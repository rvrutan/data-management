const { validateProject, validateQuery } = require('../validators/projectValidator');
const logger = require('../utils/logger');

const validateProjectData = (req, res, next) => {
  const { error } = validateProject(req.body);
  if (error) {
    logger.warn('Validation error:', error.details);
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateQueryParams = (req, res, next) => {
  const { error } = validateQuery(req.query);
  if (error) {
    logger.warn('Query validation error:', error.details);
    return res.status(400).json({
      error: 'Invalid query parameters',
      details: error.details.map(detail => detail.message)
    });
  }
  next();
};

module.exports = {
  validateProjectData,
  validateQueryParams
}; 