const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  if (JSON.stringify(req.body) !== '{}') logger.info('body', req.body);
  if (req?.cookies?.smcaRefreshToken) logger.info('cookie', req.cookies);
  logger.divider();

  next();
};

module.exports = requestLogger;
