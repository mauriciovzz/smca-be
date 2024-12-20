const readingsRuter = require('express').Router();
const readingsSchema = require('../schemas/readings');
const readingsController = require('../controllers/readings');

const {
  checkAccessToken,
  checkReqParams,
  checkNodeReadingsSpaceId,
  checkVisibility,
  isRequesterSpaceMember,
} = require('../middlewares');

// Route for visible nodes
readingsRuter.get(
  '/node-readings/:nodeId/:date',
  [
    checkReqParams(readingsSchema.nodeReadings),
    checkVisibility,
  ],
  readingsController.getNodeReadings,
);

// Route for private nodes
// will jump here from past route if checkVisibility says so
readingsRuter.get(
  '/node-readings/:nodeId/:date',
  [
    checkAccessToken,
    checkNodeReadingsSpaceId,
    isRequesterSpaceMember,
  ],
  readingsController.getNodeReadings,
);

module.exports = readingsRuter;
