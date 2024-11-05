const variablesRouter = require('express').Router();
const variablesSchemas = require('../schemas/variables');
const variablesController = require('../controllers/variables');

const {
  checkAccessToken, checkReqParams, checkReqBody, checkSpaceId,
  checkVariableId, isRequesterSpaceAdmin,
  isRequesterSpaceMember,
} = require('../middlewares');

variablesRouter.post(
  '/:spaceId/variables',
  [
    checkAccessToken,
    checkReqParams(variablesSchemas.spaceId),
    checkSpaceId,
    isRequesterSpaceAdmin,
    checkReqBody(variablesSchemas.create),
  ],
  variablesController.create,
);

variablesRouter.get(
  '/:spaceId/variables',
  [
    checkAccessToken,
    checkReqParams(variablesSchemas.spaceId),
    checkSpaceId,
    isRequesterSpaceMember,
  ],
  variablesController.getAll,
);

variablesRouter.put(
  '/:spaceId/variables/:variableId',
  [
    checkAccessToken,
    checkReqParams(variablesSchemas.ids),
    checkSpaceId,
    checkVariableId,
    isRequesterSpaceAdmin,
    checkReqBody(variablesSchemas.update),
  ],
  variablesController.update,
);

variablesRouter.delete(
  '/:spaceId/variables/:variableId',
  [
    checkAccessToken,
    checkReqParams(variablesSchemas.ids),
    checkSpaceId,
    checkVariableId,
    isRequesterSpaceAdmin,
  ],
  variablesController.remove,
);

module.exports = variablesRouter;
