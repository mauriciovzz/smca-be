const locationsRouter = require('express').Router();
const locationsController = require('../controllers/locations');
const middleware = require('../utils/middlewares/middleware');
const validatorMiddleware = require('../utils/middlewares/validator');
const schemas = require('../validatorSchemas/locations');

locationsRouter.get(
  '/:workspaceId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.workspaceId),
    middleware.workspaceVerification,
    middleware.workspaceMemberVerification,
  ],
  locationsController.getAll,
);

locationsRouter.post(
  '/:workspaceId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.workspaceId),
    validatorMiddleware.validate(schemas.create),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
  ],
  locationsController.create,
);

locationsRouter.put(
  '/:workspaceId/:locationId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.idParams),
    validatorMiddleware.validate(schemas.update),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.locationVerification,
  ],
  locationsController.update,
);

locationsRouter.delete(
  '/:workspaceId/:locationId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.idParams),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.locationVerification,
  ],
  locationsController.remove,
);

module.exports = locationsRouter;
