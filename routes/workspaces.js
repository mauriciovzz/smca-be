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

workspacesRouter.post(
  '/addAccount',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.account),
  ],
  workspacesController.addAccount,
);

workspacesRouter.delete(
  '/removeAccount',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.removeAccount),
  ],
  workspacesController.removeAccount,
);

workspacesRouter.delete(
  '/leaveWorkspace',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.leaveWorkspace),
  ],
  workspacesController.leaveWorkspace,
);

workspacesRouter.put(
  '/updateAccountRole',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.account),
  ],
  workspacesController.updateAccountRole,
);

workspacesRouter.put(
  '/',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.update),
  ],
  workspacesController.update,
);

module.exports = workspacesRouter;
