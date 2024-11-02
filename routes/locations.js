const locationsRouter = require('express').Router();
const locationsController = require('../controllers/locations');
const locationsSchemas = require('../schemas/locations');

const checkAccessToken = require('../middlewares/checkAccessToken');
const checkSpaceId = require('../middlewares/spaces/checkSpaceId');
const isRequesterSpaceAdmin = require('../middlewares/spaces/isRequesterSpaceAdmin');
const isRequesterSpaceMember = require('../middlewares/spaces/isRequesterSpaceMember');
const isSpaceMember = require('../middlewares/spaces/isSpaceMember');
const isNotSelf = require('../middlewares/spaces/isNotSelf');

locationsRouter.post(
  '/',
  [
    checkAccessToken,
    validatorMiddleware.validateParams(schemas.workspaceId),
    validatorMiddleware.validate(schemas.create),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
  ],
  locationsController.create,
);

locationsRouter.get(
  '/:spaceId',
  [
    middleware.checkAccessToken,
    validatorMiddleware.validateParams(schemas.workspaceId),
    middleware.workspaceVerification,
    middleware.workspaceMemberVerification,
  ],
  locationsController.getAll,
);

locationsRouter.put(
  '/:workspaceId/:locationId',
  [
    middleware.checkAccessToken,
    validatorMiddleware.validateParams(schemas.idParams),
    validatorMiddleware.validate(schemas.update),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.locationVerification,
  ],
  locationsController.update,
);

locationsRouter.delete(
  '/:workspaceId/:locationId',
  [
    middleware.checkAccessToken,
    validatorMiddleware.validateParams(schemas.idParams),
    middleware.workspaceVerification,
    middleware.workspaceAdminVerification,
    middleware.locationVerification,
  ],
  locationsController.remove,
);

module.exports = locationsRouter;
