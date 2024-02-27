const accountsRouter = require('express').Router();
const accountsController = require('../controllers/accounts');
const middleware = require('../utils/middlewares/middleware');
const validatorMiddleware = require('../utils/middlewares/validator');
const schemas = require('../validatorSchemas/accounts');

accountsRouter.post(
  '/register',
  validatorMiddleware.validate(schemas.register),
  accountsController.register,
);

accountsRouter.post(
  '/resendVerificationLink',
  validatorMiddleware.validate(schemas.email),
  accountsController.resendVerificationLink,
);

accountsRouter.post(
  '/verifyAccount',
  validatorMiddleware.validate(schemas.verificationToken),
  accountsController.verifyAccount,
);

accountsRouter.post(
  '/recoverPassword',
  validatorMiddleware.validate(schemas.email),
  accountsController.recoverPassword,
);

accountsRouter.post(
  '/resetPassword',
  validatorMiddleware.validate(schemas.resetPassword),
  accountsController.resetPassword,
);

accountsRouter.post(
  '/login',
  validatorMiddleware.validate(schemas.login),
  accountsController.login,
);

accountsRouter.post(
  '/refreshAccessToken',
  validatorMiddleware.validate(schemas.refreshToken),
  accountsController.refreshAccessToken,
);

accountsRouter.put(
  '/updateName',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validate(schemas.updateName),
  ],
  accountsController.updateName,
);

accountsRouter.post(
  '/updateEmail',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validate(schemas.updateEmail),
  ],
  accountsController.updateEmail,
);

accountsRouter.post(
  '/verifyEmail',
  validatorMiddleware.validate(schemas.verificationToken),
  accountsController.verifyEmail,
);

accountsRouter.put(
  '/updatePassword',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validate(schemas.updatePassword),
  ],
  accountsController.updatePassword,
);

module.exports = accountsRouter;
