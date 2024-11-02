const authRouter = require('express').Router();
const authController = require('../controllers/auth');
const authSchemas = require('../schemas/auth');

const { checkReqBody } = require('../middlewares');

authRouter.post(
  '/login',
  checkReqBody(authSchemas.login),
  authController.login,
);

authRouter.post(
  '/logout',
  authController.logout,
);

authRouter.get(
  '/refresh-access-token',
  authController.refreshAccessToken,
);

module.exports = authRouter;
