const readingsRuter = require('express').Router();
const readingsSchema = require('../schemas/readings');
const readingsController = require('../controllers/readings');

const {
  checkAccessToken, checkNodeVisibility,
  checkReqParams,
  checkSpaceId, checkLocationId, checkNodeId,
  isRequesterSpaceMember,
} = require('../middlewares');

// Route for visible nodes
readingsRuter.get(
  '/:spaceId/:nodeId/:locationId/:date',
  [
    checkReqParams(readingsSchema.getDateReadings),
    checkSpaceId,
    checkNodeId,
    checkLocationId,
    checkNodeVisibility,
  ],
  readingsController.getDateReadings,
);

// Route for private nodes
// will jump here from past route if checkNodeVisibility says so
readingsRuter.get(
  '/:spaceId/:nodeId/:locationId/:date',
  [
    checkAccessToken,
    isRequesterSpaceMember,
  ],
  readingsController.getDateReadings,
);

module.exports = readingsRuter;
