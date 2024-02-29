const componentsRouter = require('express').Router();
const componentsController = require('../controllers/components');
const middleware = require('../utils/middlewares/middleware');
const validatorMiddleware = require('../utils/middlewares/validator');
const schemas = require('../validatorSchemas/components');

componentsRouter.get(
  '/getTypes',
  [
    middleware.accessTokenVerification,
  ],
  componentsController.getTypes,
);

componentsRouter.get(
  '/:workspaceId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.workspaceId),
    middleware.workspaceVerification,
    middleware.workspaceMemberVerification,
  ],
  componentsController.getAll,
);

componentsRouter.post(
  '/:workspaceId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.workspaceId),
    validatorMiddleware.validate(schemas.create),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
  ],
  componentsController.create,
);

componentsRouter.put(
  '/:workspaceId/:componentId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.idParams),
    validatorMiddleware.validate(schemas.update),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.componentVerification,
  ],
  componentsController.update,
);

componentsRouter.delete(
  '/:workspaceId/:componentId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.idParams),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.componentVerification,
  ],
  componentsController.remove,
);

module.exports = componentsRouter;
