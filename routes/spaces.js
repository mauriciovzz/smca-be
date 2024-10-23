const spacesRouter = require('express').Router();
const spacesController = require('../controllers/spaces');
const spacesSchemas = require('../schemas/spaces');

const accessTokenVerification = require('../middlewares/accessTokenVerification');
const existVerification = require('../middlewares/spaces/existVerification');
const isAdminVerification = require('../middlewares/spaces/isAdminVerification');
const isMemberVerification = require('../middlewares/spaces/isMemberVerification');
const isNotSelfVerification = require('../middlewares/spaces/isNotSelfVerification');

const accountAuthentication = require('../middlewares/accountAuthentication');
const { reqBodyValidator, reqParamsValidator } = require('../middlewares/requestDataValidator');

spacesRouter.post(
  '/',
  [
    accessTokenVerification,
    reqBodyValidator(spacesSchemas.create),
  ],
  spacesController.create,
);

spacesRouter.get(
  '/',
  [
    accessTokenVerification,
  ],
  spacesController.getAll,
);

spacesRouter.put(
  '/:spaceId/update-name',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.spaceId),
    existVerification,
    isAdminVerification,
    reqBodyValidator(spacesSchemas.updateName),
  ],
  spacesController.updateName,
);

spacesRouter.put(
  '/:spaceId/update-color',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.spaceId),
    existVerification,
    isAdminVerification,
    reqBodyValidator(spacesSchemas.updateColor),
  ],
  spacesController.updateColor,
);

spacesRouter.delete(
  '/:spaceId/leave/:accountId',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.ids),
    existVerification,
    accountAuthentication,
    isMemberVerification(),
  ],
  spacesController.leave,
);

spacesRouter.delete(
  '/:spaceId',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.spaceId),
    existVerification,
    isAdminVerification,
  ],
  spacesController.remove,
);

spacesRouter.post(
  '/:spaceId/invite',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.spaceId),
    existVerification,
    isAdminVerification,
    reqBodyValidator(spacesSchemas.invite),
  ],
  spacesController.invite,
);

spacesRouter.get(
  '/invitations/:accountId',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.accountId),
    accountAuthentication,
  ],
  spacesController.getInvites,
);

spacesRouter.post(
  '/:spaceId/invite-response',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.spaceId),
    existVerification,
    reqBodyValidator(spacesSchemas.inviteResponse),
  ],
  spacesController.inviteResponse,
);

spacesRouter.get(
  '/:spaceId/members',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.spaceId),
    existVerification,
    isMemberVerification(true),
  ],
  spacesController.getMembers,
);

spacesRouter.put(
  '/:spaceId/update-role/:accountId',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.ids),
    existVerification,
    isAdminVerification,
    isMemberVerification(),
    isNotSelfVerification,
  ],
  spacesController.updateMemberRole,
);

spacesRouter.delete(
  '/:spaceId/remove-member/:accountId',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.ids),
    existVerification,
    isAdminVerification,
    isMemberVerification(),
    isNotSelfVerification,
  ],
  spacesController.removeMember,
);

module.exports = spacesRouter;
