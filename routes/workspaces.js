const workspacesRouter = require('express').Router();
const workspacesController = require('../controllers/workspaces');
const middleware = require('../utils/middlewares/middleware');
const validatorMiddleware = require('../utils/middlewares/validator');
const schemas = require('../validatorSchemas/workspaces');

workspacesRouter.post(
  '/',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validate(schemas.create),
  ],
  workspacesController.create,
);

workspacesRouter.get(
  '/',
  middleware.accessTokenVerification,
  workspacesController.getAll,
);

workspacesRouter.get(
  '/members/:workspaceId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.workspaceId),
  ],
  workspacesController.getMembers,
);

workspacesRouter.get(
  '/invitations',
  middleware.accessTokenVerification,
  workspacesController.getInvitations,
);

workspacesRouter.post(
  '/invitationCreation',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validate(schemas.invitationCreation),
  ],
  workspacesController.invitationCreation,
);

workspacesRouter.post(
  '/invitationResponse',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validate(schemas.invitationResponse),
  ],
  workspacesController.invitationResponse,
);

workspacesRouter.put(
  '/memberRoleUpdate',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validate(schemas.memberRoleUpdate),
  ],
  workspacesController.memberRoleUpdate,
);

workspacesRouter.delete(
  '/memberRemoval/:workspaceId/:accountId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.memberRemoval),
  ],
  workspacesController.memberRemoval,
);

workspacesRouter.put(
  '/updateName',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validate(schemas.updateName),
  ],
  workspacesController.updateName,
);

workspacesRouter.put(
  '/updateColor',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validate(schemas.updateColor),
  ],
  workspacesController.updateColor,
);

workspacesRouter.delete(
  '/leaveWorkspace/:workspaceId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.workspaceId),
  ],
  workspacesController.leaveWorkspace,
);

workspacesRouter.delete(
  '/deleteWorkspace/:workspaceId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.workspaceId),
  ],
  workspacesController.deleteWorkspace,
);

module.exports = workspacesRouter;
