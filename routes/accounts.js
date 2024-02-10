const accountsRouter = require('express').Router();
const accountsController = require('../controllers/accounts');
const middleware = require('../utils/middleware');
const validatorMiddleware = require('../utils/validator');
const schemas = require('../validatorSchemas/accounts');

accountsRouter.post(
  '/register',
  validatorMiddleware.validate(schemas.register),
  accountsController.register,
);

accountsRouter.post(
  '/login',
  validatorMiddleware.validate(schemas.login),
  accountsController.login,
);

accountsRouter.post(
  '/refreshAccessToken',
  validatorMiddleware.validate(schemas.token),
  accountsController.refreshAccessToken,
);

accountsRouter.post(
  '/forgotPassword',
  validatorMiddleware.validate(schemas.email),
  accountsController.forgotPassword,
);

accountsRouter.post(
  '/resetPassword/:accountId/:verificationToken',
  [
    validatorMiddleware.validate(schemas.resetPassword),
    validatorMiddleware.validateParams(schemas.resetPasswordParams),
  ],
  accountsController.resetPassword,
);

accountsRouter.put(
  '/updateName',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.updateName),
  ],
  accountsController.updateName,
);

accountsRouter.post(
  '/updateEmail',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.updateEmail),
  ],
  accountsController.updateEmail,
);

accountsRouter.post(
  '/confirmEmail',
  validatorMiddleware.validate(schemas.verificationToken),
  accountsController.confirmEmail,
);

accountsRouter.put(
  '/updatePassword',
  [
    middleware.AccessTokenVerification,
    validatorMiddleware.validate(schemas.updatePassword),
  ],
  accountsController.updatePassword,
);

module.exports = accountsRouter;
