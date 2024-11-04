const invitationsRouter = require('express').Router();
const invitationsSchemas = require('../schemas/invitations');
const invitationsController = require('../controllers/invitations');

const {
  checkAccessToken, checkReqParams, checkReqBody, checkSpaceId,
  checkAccountId, isRequesterSpaceAdmin,
} = require('../middlewares');

invitationsRouter.post(
  '/:spaceid',
  [
    checkAccessToken,
    checkReqParams(invitationsSchemas.spaceId),
    checkSpaceId,
    isRequesterSpaceAdmin,
    checkReqBody(invitationsSchemas.invite),
  ],
  invitationsController.invite,
);

invitationsRouter.get(
  '/:accountId',
  [
    checkAccessToken,
    checkReqParams(invitationsSchemas.accountId),
    checkAccountId,
  ],
  invitationsController.getInvitations,
);

invitationsRouter.post(
  '/:spaceId/response/:accountId',
  [
    checkAccessToken,
    checkReqParams(invitationsSchemas.ids),
    checkSpaceId,
    checkReqBody(invitationsSchemas.invitationResponse),
  ],
  invitationsController.invitationResponse,
);

module.exports = invitationsRouter;
