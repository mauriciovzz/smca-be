const accountsRouter = require('express').Router();
const accountsController = require('../controllers/accounts');
const accountSchemas = require('../schemas/accounts');

const {
  checkAccessToken, checkReqParams, checkReqBody,
  checkAccountId, checkVerificationToken,
} = require('../middlewares');

accountsRouter.post(
  '/',
  checkReqBody(accountSchemas.create),
  accountsController.create,
);

accountsRouter.post(
  '/verify-account/:accountId/:verificationToken',
  [
    checkReqParams(accountSchemas.verificationToken),
    checkVerificationToken('account'),
  ],
  accountsController.verifyAccount,
);

accountsRouter.post(
  '/resend-account-verification-email',
  checkReqBody(accountSchemas.email),
  accountsController.resendAccountVerificationEmail,
);

accountsRouter.get(
  '/:accountId',
  [
    checkAccessToken,
    checkReqParams(accountSchemas.accountId),
    checkAccountId,
  ],
  accountsController.get,
);

accountsRouter.put(
  '/:accountId/update-name',
  [
    checkAccessToken,
    checkReqParams(accountSchemas.accountId),
    checkReqBody(accountSchemas.updateName),
    checkAccountId,
  ],
  accountsController.updateName,
);

accountsRouter.put(
  '/:accountId/update-password',
  [
    checkAccessToken,
    checkReqParams(accountSchemas.accountId),
    checkReqBody(accountSchemas.updatePassword),
    checkAccountId,
  ],
  accountsController.updatePassword,
);

accountsRouter.put(
  '/:accountId/update-email',
  [
    checkAccessToken,
    checkReqParams(accountSchemas.accountId),
    checkReqBody(accountSchemas.updateEmail),
    checkAccountId,
  ],
  accountsController.updateEmail,
);

accountsRouter.post(
  '/verify-new-email/:accountId/:verificationToken',
  [
    checkReqParams(accountSchemas.verificationToken),
    checkVerificationToken('email'),
  ],
  accountsController.verifyNewEmail,
);

accountsRouter.delete(
  '/:accountId',
  [
    checkAccessToken,
    checkReqParams(accountSchemas.accountId),
    checkReqBody(accountSchemas.remove),
    checkAccountId,
  ],
  accountsController.remove,
);

accountsRouter.post(
  '/recover-password',
  checkReqBody(accountSchemas.email),
  accountsController.recoverPassword,
);

accountsRouter.post(
  '/reset-password/:accountId/:verificationToken',
  [
    checkReqParams(accountSchemas.verificationToken),
    checkReqBody(accountSchemas.resetPassword),
    checkVerificationToken('password'),
  ],
  accountsController.resetPassword,
);

module.exports = accountsRouter;
