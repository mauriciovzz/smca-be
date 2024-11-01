const spacesRouter = require('express').Router();
const spacesController = require('../controllers/spaces');
const spacesSchemas = require('../schemas/spaces');

const accessTokenVerification = require('../middlewares/accessTokenVerification');
const existVerification = require('../middlewares/spaces/existVerification');
const amIAdminVerification = require('../middlewares/spaces/amIAdminVerification');
const amIMemberVerification = require('../middlewares/spaces/amIMemberVerification');
const areTheyMemberVerification = require('../middlewares/spaces/areTheyMemberVerification');
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

spacesRouter.get(
  '/:spaceId',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.spaceId),
    existVerification,
    amIMemberVerification,
  ],
  spacesController.getOne,
);

spacesRouter.put(
  '/:spaceId/update-name',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.spaceId),
    existVerification,
    amIAdminVerification,
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
    amIAdminVerification,
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
    amIMemberVerification,
  ],
  spacesController.leave,
);

spacesRouter.delete(
  '/:spaceId',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.spaceId),
    existVerification,
    amIAdminVerification,
  ],
  spacesController.remove,
);

spacesRouter.post(
  '/:spaceId/invite',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.spaceId),
    existVerification,
    amIAdminVerification,
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
  spacesController.getInvitations,
);

spacesRouter.post(
  '/:spaceId/invitation-response',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.spaceId),
    existVerification,
    reqBodyValidator(spacesSchemas.invitationResponse),
  ],
  spacesController.invitationResponse,
);

spacesRouter.get(
  '/:spaceId/members',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.spaceId),
    existVerification,
    amIMemberVerification,
  ],
  spacesController.getMembers,
);

spacesRouter.put(
  '/:spaceId/update-role/:accountId',
  [
    accessTokenVerification,
    reqParamsValidator(spacesSchemas.ids),
    existVerification,
    amIAdminVerification,
    areTheyMemberVerification,
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
    amIAdminVerification,
    areTheyMemberVerification,
    isNotSelfVerification,
  ],
  spacesController.removeMember,
);

module.exports = spacesRouter;
