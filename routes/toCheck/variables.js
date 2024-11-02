const variablesRouter = require('express').Router();
const variablesController = require('../controllers/variables');
const middleware = require('../utils/middlewares/middleware');
const validatorMiddleware = require('../utils/middlewares/validator');
const schemas = require('../../schemas/toCheck/variables');

variablesRouter.get(
  '/getTypes',
  [
    middleware.checkAccessToken,
  ],
  variablesController.getTypes,
);

variablesRouter.get(
  '/getValueTypes',
  [
    middleware.checkAccessToken,
  ],
  variablesController.getValueTypes,
);

variablesRouter.get(
  '/:workspaceId',
  [
    middleware.checkAccessToken,
    validatorMiddleware.validateParams(schemas.workspaceId),
    middleware.workspaceVerification,
    middleware.workspaceMemberVerification,
  ],
  variablesController.getAll,
);

variablesRouter.post(
  '/:workspaceId',
  [
    middleware.checkAccessToken,
    validatorMiddleware.validateParams(schemas.workspaceId),
    validatorMiddleware.validate(schemas.create),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
  ],
  variablesController.create,
);

variablesRouter.put(
  '/:workspaceId/:variableId',
  [
    middleware.checkAccessToken,
    validatorMiddleware.validateParams(schemas.idParams),
    validatorMiddleware.validate(schemas.update),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.variableVerification,
  ],
  variablesController.update,
);

variablesRouter.delete(
  '/:workspaceId/:variableId',
  [
    middleware.checkAccessToken,
    validatorMiddleware.validateParams(schemas.idParams),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.variableVerification,
  ],
  variablesController.remove,
);

module.exports = variablesRouter;
