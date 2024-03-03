const nodesRouter = require('express').Router();
const nodesController = require('../controllers/nodes');
const middleware = require('../utils/middlewares/middleware');
const validatorMiddleware = require('../utils/middlewares/validator');
const schemas = require('../validatorSchemas/nodes');

nodesRouter.get(
  '/getTypes',
  [
    middleware.accessTokenVerification,
  ],
  nodesController.getTypes,
);

nodesRouter.get(
  '/:workspaceId',
  [
    middleware.accessTokenVerification,
    validatorMiddleware.validateParams(schemas.workspaceId),
    middleware.workspaceVerification,
    middleware.workspaceMemberVerification,
  ],
  nodesController.getAll,
);

// variables example

// nodesRouter.post(
//   '/:workspaceId',
//   [
//     middleware.accessTokenVerification,
//     validatorMiddleware.validateParams(schemas.workspaceId),
//     validatorMiddleware.validate(schemas.create),
//     middleware.workspaceVerification,
//     middleware.workspaceAdminVerification,
//   ],
//   nodesController.create,
// );

// nodesRouter.put(
//   '/:workspaceId/:variableId',
//   [
//     middleware.accessTokenVerification,
//     validatorMiddleware.validateParams(schemas.idParams),
//     validatorMiddleware.validate(schemas.update),
//     middleware.workspaceVerification,
//     middleware.workspaceAdminVerification,
//     middleware.variableVerification,
//   ],
//   nodesController.update,
// );

// nodesRouter.delete(
//   '/:workspaceId/:variableId',
//   [
//     middleware.accessTokenVerification,
//     validatorMiddleware.validateParams(schemas.idParams),
//     middleware.workspaceVerification,
//     middleware.workspaceAdminVerification,
//     middleware.variableVerification,
//   ],
//   nodesController.remove,
// );

// old

// /* Get all active nodes */
// nodesRouter.get('/active', nodesController.getActiveNodes);

// /* Get all nodes */
// nodesRouter.get('/all', nodesController.getAllNodes);

// /* Get all reading averages of a node */
// nodesRouter.get('/:nodeType/:nodeId/:lat/:long/:date/:variableType'
// , nodesController.getReadingAverages);

// /* Get range of reading averages of a node */
// nodesRouter.get('/:nodeType/:nodeId/:lat/:long/:date/:variableType/range'
// , nodesController.getAveragesRange);

// /* Add a node */
// nodesRouter.post(
//   '/',
//   [middleware.accessTokenVerification],
//   nodesController.create,
// );

// /* Get all variables of a node */
// nodesRouter.get('/:nodeType/:nodeId/variables', nodesController.getVariables);

module.exports = nodesRouter;
