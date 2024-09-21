const photosRouter = require('express').Router();
const photosController = require('../controllers/photos');
const middleware = require('../utils/middlewares/middleware');
const validatorMiddleware = require('../utils/middlewares/validator');
const schemas = require('../validatorSchemas/readings');

photosRouter.get(
  '/getPublicNodephotos/:nodeId/:locationId/:date',
  [
    validatorMiddleware.validateParams(schemas.readingsParams),
    middleware.nodeVerification,
    middleware.nodeStateVerification,
    middleware.publicVerification,
  ],
  photosController.getNodePhotos,
);

photosRouter.get(
  '/getPrivateNodePhotos/:nodeId/:locationId/:date',
  [
    validatorMiddleware.validateParams(schemas.readingsParams),
    middleware.nodeVerification,
    middleware.nodeStateVerification,
    middleware.accessTokenVerification,
    middleware.nodeAccessVerification,
  ],
  photosController.getNodePhotos,
);

module.exports = photosRouter;
