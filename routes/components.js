const componentsRouter = require('express').Router();
const componentsSchema = require('../schemas/components');
const componentsController = require('../controllers/components');

const {
  checkAccessToken, checkReqParams, checkReqBody, checkSpaceId,
  checkComponentId, isRequesterSpaceAdmin, isRequesterSpaceMember,
} = require('../middlewares');

componentsRouter.post(
  '/:spaceId/components',
  [
    checkAccessToken,
    checkReqParams(componentsSchema.spaceId),
    checkSpaceId,
    isRequesterSpaceAdmin,
    checkReqBody(componentsSchema.create),
  ],
  componentsController.create,
);

componentsRouter.get(
  '/:spaceId/components',
  [
    checkAccessToken,
    checkReqParams(componentsSchema.spaceId),
    checkSpaceId,
    isRequesterSpaceMember,
  ],
  componentsController.getAll,
);

componentsRouter.put(
  '/:spaceId/components/:componentId',
  [
    checkAccessToken,
    checkReqParams(componentsSchema.ids),
    checkSpaceId,
    checkComponentId,
    isRequesterSpaceAdmin,
    checkReqBody(componentsSchema.update),
  ],
  componentsController.update,
);

componentsRouter.delete(
  '/:spaceId/components/:componentId',
  [
    checkAccessToken,
    checkReqParams(componentsSchema.ids),
    checkSpaceId,
    checkComponentId,
    isRequesterSpaceAdmin,
  ],
  componentsController.remove,
);

module.exports = componentsRouter;
