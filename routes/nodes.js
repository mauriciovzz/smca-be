const nodesRouter = require('express').Router();
const nodesController = require('../controllers/nodes');
const middleware = require('../utils/middlewares/middleware');
const validatorMiddleware = require('../utils/middlewares/validator');
const schemas = require('../validatorSchemas/nodes');

nodesRouter.get(
  '/getTypes',
  [
    middleware.accessTokenVerification,
  ],
  nodesController.getTypes,
);

nodesRouter.get(
  '/getStates',
  [
    middleware.accessTokenVerification,
  ],
  nodesController.getStates,
);

nodesRouter.get(
  '/publicNodes',
  nodesController.getPublicNodes,
);

nodesRouter.get(
  '/accountNodes',
  [
    middleware.accessTokenVerification,
  ],
  nodesController.getAccountNodes,
);

nodesRouter.get(
  '/workspaceNodes/:workspaceId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.workspaceId),
    middleware.workspaceVerification,
    middleware.workspaceMemberVerification,
  ],
  nodesController.getWorkspaceNodes,
);

nodesRouter.get(
  '/:workspaceId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.workspaceId),
    middleware.workspaceVerification,
    middleware.workspaceMemberVerification,
  ],
  nodesController.getAll,
);

nodesRouter.get(
  '/privateNodeComponents/:workspaceId/:nodeId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.idParams),
    middleware.workspaceVerification,
    middleware.workspaceMemberVerification,
    middleware.nodeVerification,
    middleware.nodeWorkspaceVerification,
  ],
  nodesController.getComponents,
);

nodesRouter.get(
  '/publicNodeComponents/:workspaceId/:nodeId',
  [
    validatorMiddleware.validateParams(schemas.idParams),
    middleware.workspaceVerification,
    middleware.nodeVerification,
    middleware.nodeWorkspaceVerification,
  ],
  nodesController.getComponents,
);

nodesRouter.get(
  '/getConfigFile/:workspaceId/:nodeId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.idParams),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.nodeVerification,
    middleware.nodeStateVerification,
    middleware.nodeWorkspaceVerification,
  ],
  nodesController.getConfigFile,
);

nodesRouter.post(
  '/:workspaceId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.workspaceId),
    validatorMiddleware.validate(schemas.create),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.nodeNameVerification,
    middleware.nodeTypeVerification,
    middleware.nodeComponentsAndVariablesVerification,
    middleware.nodeQuantitiesVerification,
    middleware.nodeLocationVerification,
  ],
  nodesController.create,
);

nodesRouter.put(
  '/updateName/:workspaceId/:nodeId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.idParams),
    validatorMiddleware.validate(schemas.updateName),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.nodeVerification,
    middleware.nodeStateVerification,
    middleware.nodeWorkspaceVerification,
    middleware.nodeNameVerification,
  ],
  nodesController.updateName,
);

nodesRouter.put(
  '/updateState/:workspaceId/:nodeId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.idParams),
    validatorMiddleware.validate(schemas.updateState),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.nodeVerification,
    middleware.nodeStateVerification,
    middleware.nodeWorkspaceVerification,
  ],
  nodesController.updateState,
);

nodesRouter.put(
  '/updateType/:workspaceId/:nodeId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.idParams),
    validatorMiddleware.validate(schemas.updateType),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.nodeVerification,
    middleware.nodeStateVerification,
    middleware.nodeWorkspaceVerification,
    middleware.nodeTypeVerification,
  ],
  nodesController.updateType,
);

nodesRouter.put(
  '/updateVisibility/:workspaceId/:nodeId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.idParams),
    validatorMiddleware.validate(schemas.updateVisibility),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.nodeVerification,
    middleware.nodeStateVerification,
    middleware.nodeWorkspaceVerification,
  ],
  nodesController.updateVisibility,
);

nodesRouter.put(
  '/updateLocation/:workspaceId/:nodeId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.idParams),
    validatorMiddleware.validate(schemas.updateLocation),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.nodeVerification,
    middleware.nodeStateVerification,
    middleware.nodeWorkspaceVerification,
    middleware.nodeLocationVerification,
  ],
  nodesController.updateLocation,
);

nodesRouter.put(
  '/updateComponents/:workspaceId/:nodeId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.idParams),
    validatorMiddleware.validate(schemas.updateComponents),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.nodeComponentsAndVariablesVerification,
    middleware.nodeQuantitiesVerification,
  ],
  nodesController.updateComponents,
);

nodesRouter.delete(
  '/:workspaceId/:nodeId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.idParams),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.nodeVerification,
    middleware.nodeWorkspaceVerification,
  ],
  nodesController.remove,
);

module.exports = nodesRouter;
