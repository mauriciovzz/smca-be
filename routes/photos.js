const photosRouter = require('express').Router();
const photosSchema = require('../schemas/photos');
const photosController = require('../controllers/photos');

const {
  checkAccessToken, checkNodeVisibility,
  checkReqParams,
  checkSpaceId, checkLocationId, checkNodeId,
  isRequesterSpaceMember,
} = require('../middlewares');

// Get photo route for visible nodes
photosRouter.get(
  '/:spaceId/:nodeId/:locationId/:date/:hour',
  [
    checkReqParams(photosSchema.getPhoto),
    checkSpaceId,
    checkNodeId,
    checkLocationId,
    checkNodeVisibility,
  ],
  photosController.getPhoto,
);

// Get photo route for private nodes
// will jump here from past route if checkNodeVisibility says so
photosRouter.get(
  '/:spaceId/:nodeId/:locationId/:date/:hour',
  [
    checkAccessToken,
    isRequesterSpaceMember,
  ],
  photosController.getPhoto,
);

// Check date for photos route for visible nodes
photosRouter.get(
  '/:spaceId/:nodeId/:locationId/:date',
  [
    checkReqParams(photosSchema.checkDateForPhotos),
    checkSpaceId,
    checkNodeId,
    checkLocationId,
    checkNodeVisibility,
  ],
  photosController.checkDateForPhotos,
);

// Check date for photos route for private nodes
// will jump here from past route if checkNodeVisibility says so
photosRouter.get(
  '/:spaceId/:nodeId/:locationId/:date',
  [
    checkAccessToken,
    isRequesterSpaceMember,
  ],
  photosController.checkDateForPhotos,
);

module.exports = photosRouter;
