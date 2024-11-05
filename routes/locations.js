const locationsRouter = require('express').Router();
const locationsSchemas = require('../schemas/locations');
const locationsController = require('../controllers/locations');

const {
  checkAccessToken, checkReqParams, checkReqBody, checkSpaceId,
  checkLocationId, isRequesterSpaceAdmin,
  isRequesterSpaceMember,
} = require('../middlewares');

locationsRouter.post(
  '/:spaceId/locations',
  [
    checkAccessToken,
    checkReqParams(locationsSchemas.spaceId),
    checkSpaceId,
    isRequesterSpaceAdmin,
    checkReqBody(locationsSchemas.create),
  ],
  locationsController.create,
);

locationsRouter.get(
  '/:spaceId/locations',
  [
    checkAccessToken,
    checkReqParams(locationsSchemas.spaceId),
    checkSpaceId,
    isRequesterSpaceMember,
  ],
  locationsController.getAll,
);

locationsRouter.put(
  '/:spaceId/locations/:locationId',
  [
    checkAccessToken,
    checkReqParams(locationsSchemas.ids),
    checkSpaceId,
    checkLocationId,
    isRequesterSpaceAdmin,
    checkReqBody(locationsSchemas.update),
  ],
  locationsController.update,
);

locationsRouter.delete(
  '/:spaceId/locations/:locationId/remove-readings',
  [
    checkAccessToken,
    checkReqParams(locationsSchemas.ids),
    checkSpaceId,
    checkLocationId,
    isRequesterSpaceAdmin,
  ],
  locationsController.removeReadings,
);

locationsRouter.delete(
  '/:spaceId/locations/:locationId',
  [
    checkAccessToken,
    checkReqParams(locationsSchemas.ids),
    checkSpaceId,
    checkLocationId,
    isRequesterSpaceAdmin,
  ],
  locationsController.remove,
);

module.exports = locationsRouter;
