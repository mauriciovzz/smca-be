const accountsRouter = require('express').Router();
const accountsController = require('../controllers/accounts');
const accountSchemas = require('../schemas/accounts');

const accessTokenVerification = require('../middlewares/accessTokenVerification');
const { reqBodyValidator, reqParamsValidator } = require('../middlewares/requestDataValidator');
const accountAuthentication = require('../middlewares/accountAuthentication');
const verificationTokenVerification = require('../middlewares/verificationTokenVerification');

accountsRouter.post(
  '/',
  reqBodyValidator(accountSchemas.create),
  accountsController.create,
);

accountsRouter.post(
  '/verify/:accountId/:verificationToken',
  [
    reqParamsValidator(accountSchemas.verificationToken),
    verificationTokenVerification('account'),
  ],
  accountsController.verify,
);

accountsRouter.post(
  '/resend-account-verification-email',
  reqBodyValidator(accountSchemas.email),
  accountsController.resendAccountVerificationEmail,
);

accountsRouter.get(
  '/:accountId',
  [
    accessTokenVerification,
    reqParamsValidator(accountSchemas.accountId),
    accountAuthentication,
  ],
  accountsController.get,
);

accountsRouter.put(
  '/:accountId/update-name',
  [
    accessTokenVerification,
    reqParamsValidator(accountSchemas.accountId),
    reqBodyValidator(accountSchemas.updateName),
    accountAuthentication,
  ],
  accountsController.updateName,
);

accountsRouter.put(
  '/:accountId/update-password',
  [
    accessTokenVerification,
    reqParamsValidator(accountSchemas.accountId),
    reqBodyValidator(accountSchemas.updatePassword),
    accountAuthentication,
  ],
  accountsController.updatePassword,
);

accountsRouter.post(
  '/:accountId/update-email',
  [
    accessTokenVerification,
    reqParamsValidator(accountSchemas.accountId),
    reqBodyValidator(accountSchemas.updateEmail),
    accountAuthentication,
  ],
  accountsController.updateEmail,
);

accountsRouter.post(
  '/verify-new-email/:accountId/:verificationToken',
  [
    reqParamsValidator(accountSchemas.verificationToken),
    verificationTokenVerification('email'),
  ],
  accountsController.verifyNewEmail,
);

accountsRouter.delete(
  '/:accountId',
  [
    accessTokenVerification,
    reqParamsValidator(accountSchemas.accountId),
    reqBodyValidator(accountSchemas.remove),
    accountAuthentication,
  ],
  accountsController.remove,
);

accountsRouter.post(
  '/recover-password',
  reqBodyValidator(accountSchemas.email),
  accountsController.recoverPassword,
);

accountsRouter.post(
  '/reset-password/:accountId/:verificationToken',
  [
    reqParamsValidator(accountSchemas.verificationToken),
    reqBodyValidator(accountSchemas.resetPassword),
    verificationTokenVerification('password'),
  ],
  accountsController.resetPassword,
);

module.exports = accountsRouter;
