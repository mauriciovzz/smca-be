const nodesRouter = require('express').Router();
const nodesSchema = require('../schemas/nodes');
const nodesController = require('../controllers/nodes');

const {
  checkAccessToken, checkReqParams, checkReqBody, checkSpaceId,
  checkNodeId, isRequesterSpaceAdmin, isRequesterSpaceMember,
} = require('../middlewares');

nodesRouter.post(
  '/:spaceId/nodes',
  [
    checkAccessToken,
    checkReqParams(nodesSchema.spaceId),
    checkSpaceId,
    isRequesterSpaceAdmin,
    checkReqBody(nodesSchema.create),
  ],
  nodesController.create,
);

nodesRouter.get(
  '/:spaceId/nodes',
  [
    checkAccessToken,
    checkReqParams(nodesSchema.spaceId),
    checkSpaceId,
    isRequesterSpaceMember,
  ],
  nodesController.getSpaceNodes,
);

nodesRouter.get(
  '/:spaceId/nodes/:nodeId/components',
  [
    checkAccessToken,
    checkReqParams(nodesSchema.ids),
    checkSpaceId,
    checkNodeId,
    isRequesterSpaceMember,
  ],
  nodesController.getComponents,
);

nodesRouter.get(
  '/:spaceId/nodes/:nodeId/config-file',
  [
    checkAccessToken,
    checkReqParams(nodesSchema.ids),
    checkSpaceId,
    checkNodeId,
    isRequesterSpaceAdmin,
  ],
  nodesController.getConfigFile,
);

nodesRouter.put(
  '/:spaceId/nodes/:nodeId',
  [
    checkAccessToken,
    checkReqParams(nodesSchema.ids),
    checkSpaceId,
    checkNodeId,
    isRequesterSpaceAdmin,
    checkReqBody(nodesSchema.updateInfo),
  ],
  nodesController.updateInfo,
);

nodesRouter.put(
  '/:spaceId/nodes/:nodeId/location',
  [
    checkAccessToken,
    checkReqParams(nodesSchema.ids),
    checkSpaceId,
    checkNodeId,
    isRequesterSpaceAdmin,
    checkReqBody(nodesSchema.updateLocation),
  ],
  nodesController.updateLocation,
);

nodesRouter.put(
  '/:spaceId/nodes/:nodeId/components',
  [
    checkAccessToken,
    checkReqParams(nodesSchema.ids),
    checkSpaceId,
    checkNodeId,
    isRequesterSpaceAdmin,
    checkReqBody(nodesSchema.updateComponents),
  ],
  nodesController.updateComponents,
);

nodesRouter.delete(
  '/:spaceId/nodes/:nodeId',
  [
    checkAccessToken,
    checkReqParams(nodesSchema.ids),
    checkSpaceId,
    checkNodeId,
    isRequesterSpaceAdmin,
  ],
  nodesController.remove,
);

module.exports = nodesRouter;
