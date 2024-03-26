const readingsRuter = require('express').Router();
const averageReadingsController = require('../controllers/readings');
const middleware = require('../utils/middlewares/middleware');
const validatorMiddleware = require('../utils/middlewares/validator');
const schemas = require('../validatorSchemas/readings');

readingsRuter.get(
  '/getPublicNodeReadings/:nodeId/:date',
  [
    validatorMiddleware.validateParams(schemas.readingsParams),
    middleware.nodeVerification,
    middleware.nodeStateVerification,
    middleware.publicVerification,
  ],
  averageReadingsController.getNodeReadings,
);

readingsRuter.get(
  '/getPrivateNodeReadings/:nodeId/:date',
  [
    validatorMiddleware.validateParams(schemas.readingsParams),
    middleware.nodeVerification,
    middleware.nodeStateVerification,
    middleware.accessTokenVerification,
    middleware.nodeAccessVerification,
  ],
  averageReadingsController.getNodeReadings,
);

module.exports = readingsRuter;
