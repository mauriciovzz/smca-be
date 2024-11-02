const spacesRouter = require('express').Router();
const spacesController = require('../controllers/spaces');
const spacesSchemas = require('../schemas/spaces');

const {
  checkAccessToken, checkReqParams, checkReqBody, checkSpaceId,
  checkAccountId, isRequesterSpaceAdmin, isRequesterSpaceMember,
  isSpaceMember, isNotSelf,

} = require('../middlewares');

spacesRouter.post(
  '/',
  [
    checkAccessToken,
    checkReqBody(spacesSchemas.create),
  ],
  spacesController.create,
);

spacesRouter.get(
  '/',
  [
    checkAccessToken,
  ],
  spacesController.getAll,
);

spacesRouter.get(
  '/:spaceId',
  [
    checkAccessToken,
    checkReqParams(spacesSchemas.spaceId),
    checkSpaceId,
    isRequesterSpaceMember,
  ],
  spacesController.getOne,
);

spacesRouter.put(
  '/:spaceId/update-name',
  [
    checkAccessToken,
    checkReqParams(spacesSchemas.spaceId),
    checkSpaceId,
    isRequesterSpaceAdmin,
    checkReqBody(spacesSchemas.updateName),
  ],
  spacesController.updateName,
);

spacesRouter.put(
  '/:spaceId/update-color',
  [
    checkAccessToken,
    checkReqParams(spacesSchemas.spaceId),
    checkSpaceId,
    isRequesterSpaceAdmin,
    checkReqBody(spacesSchemas.updateColor),
  ],
  spacesController.updateColor,
);

spacesRouter.delete(
  '/:spaceId/leave/:accountId',
  [
    checkAccessToken,
    checkReqParams(spacesSchemas.ids),
    checkSpaceId,
    checkAccountId,
    isRequesterSpaceMember,
  ],
  spacesController.leave,
);

spacesRouter.delete(
  '/:spaceId',
  [
    checkAccessToken,
    checkReqParams(spacesSchemas.spaceId),
    checkSpaceId,
    isRequesterSpaceAdmin,
  ],
  spacesController.remove,
);

spacesRouter.post(
  '/:spaceId/invite',
  [
    checkAccessToken,
    checkReqParams(spacesSchemas.spaceId),
    checkSpaceId,
    isRequesterSpaceAdmin,
    checkReqBody(spacesSchemas.invite),
  ],
  spacesController.invite,
);

spacesRouter.get(
  '/invitations/:accountId',
  [
    checkAccessToken,
    checkReqParams(spacesSchemas.accountId),
    checkAccountId,
  ],
  spacesController.getInvitations,
);

spacesRouter.post(
  '/:spaceId/invitation-response',
  [
    checkAccessToken,
    checkReqParams(spacesSchemas.spaceId),
    checkSpaceId,
    checkReqBody(spacesSchemas.invitationResponse),
  ],
  spacesController.invitationResponse,
);

spacesRouter.get(
  '/:spaceId/members',
  [
    checkAccessToken,
    checkReqParams(spacesSchemas.spaceId),
    checkSpaceId,
    isRequesterSpaceMember,
  ],
  spacesController.getMembers,
);

spacesRouter.put(
  '/:spaceId/update-role/:accountId',
  [
    checkAccessToken,
    checkReqParams(spacesSchemas.ids),
    checkSpaceId,
    isRequesterSpaceAdmin,
    isSpaceMember,
    isNotSelf,
  ],
  spacesController.updateMemberRole,
);

spacesRouter.delete(
  '/:spaceId/remove-member/:accountId',
  [
    checkAccessToken,
    checkReqParams(spacesSchemas.ids),
    checkSpaceId,
    isRequesterSpaceAdmin,
    isSpaceMember,
    isNotSelf,
  ],
  spacesController.removeMember,
);

module.exports = spacesRouter;
