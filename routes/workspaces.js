const workspacesRouter = require('express').Router();
const workspacesController = require('../controllers/workspaces');
const middleware = require('../utils/middleware');
const validatorMiddleware = require('../utils/validator');
const schemas = require('../validatorSchemas/workspaces');

workspacesRouter.post(
  '/',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.create),
  ],
  workspacesController.create,
);

workspacesRouter.get(
  '/',
  middleware.AccessTokenVerification,
  workspacesController.getAll,
);

workspacesRouter.put(
  '/updateName',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.updateName),
  ],
  workspacesController.updateName,
);

workspacesRouter.put(
  '/updateColor',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.updateColor),
  ],
  workspacesController.updateColor,
);

workspacesRouter.get(
  '/members/:workspaceId',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validateParams(schemas.workspaceId),
  ],
  workspacesController.getMembers,
);

workspacesRouter.get(
  '/invitations',
  middleware.AccessTokenVerification,
  workspacesController.getInvitations,
);

workspacesRouter.post(
  '/invitationCreation',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.invitationCreation),
  ],
  workspacesController.invitationCreation,
);

workspacesRouter.post(
  '/invitationResponse',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.invitationResponse),
  ],
  workspacesController.invitationResponse,
);

workspacesRouter.put(
  '/memberRoleUpdate',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.memberRoleUpdate),
  ],
  workspacesController.memberRoleUpdate,
);

workspacesRouter.delete(
  '/memberRemoval/:workspaceId/:accountId',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validateParams(schemas.memberRemoval),
  ],
  workspacesController.memberRemoval,
);

workspacesRouter.delete(
  '/leaveWorkspace/:workspaceId',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validateParams(schemas.workspaceId),
  ],
  workspacesController.leaveWorkspace,
);

module.exports = workspacesRouter;
