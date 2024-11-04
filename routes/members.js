const membersRouter = require('express').Router();
const membersSchemas = require('../schemas/members');
const membersController = require('../controllers/members');

const {
  checkAccessToken, checkReqParams, checkSpaceId, checkAccountId,
  isRequesterSpaceAdmin, isRequesterSpaceMember, checkMemberId,
} = require('../middlewares');

membersRouter.get(
  '/:spaceId/members',
  [
    checkAccessToken,
    checkReqParams(membersSchemas.spaceId),
    checkSpaceId,
    isRequesterSpaceMember,
  ],
  membersController.getAll,
);

membersRouter.put(
  '/:spaceId/members/:accountId',
  [
    checkAccessToken,
    checkReqParams(membersSchemas.ids),
    checkSpaceId,
    isRequesterSpaceAdmin,
    checkMemberId,
  ],
  membersController.updateMemberRole,
);

membersRouter.delete(
  '/:spaceId/members/:accountId/leave',
  [
    checkAccessToken,
    checkReqParams(membersSchemas.ids),
    checkSpaceId,
    checkAccountId,
    isRequesterSpaceMember,
  ],
  membersController.leaveSpace,
);

membersRouter.delete(
  '/:spaceId/members/:accountId/remove',
  [
    checkAccessToken,
    checkReqParams(membersSchemas.ids),
    checkSpaceId,
    isRequesterSpaceAdmin,
    checkMemberId,
  ],
  membersController.removeMember,
);

module.exports = membersRouter;
