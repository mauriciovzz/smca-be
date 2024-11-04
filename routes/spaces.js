const spacesRouter = require('express').Router();
const spacesSchemas = require('../schemas/spaces');
const spacesController = require('../controllers/spaces');

const {
  checkAccessToken, checkReqParams, checkReqBody, checkSpaceId,
  isRequesterSpaceAdmin, isRequesterSpaceMember,
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
  '/:spaceId',
  [
    checkAccessToken,
    checkReqParams(spacesSchemas.spaceId),
    checkSpaceId,
    isRequesterSpaceAdmin,
  ],
  spacesController.remove,
);

module.exports = spacesRouter;
