const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  if (JSON.stringify(req.body) !== '{}') logger.info(req.body);
  logger.divider();

  next();
};

module.exports = requestLogger;
