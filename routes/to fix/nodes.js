const nodesRouter = require('express').Router();
const nodesController = require('../../controllers/to fix/nodes');
const middleware = require('../../utils/middleware');

const allowedRoles = ['RESEARCHER', 'ADMIN'];

/* Get all active nodes */
nodesRouter.get('/active', nodesController.getActiveNodes);

/* Get all nodes */
nodesRouter.get('/all', [middleware.AccessTokenVerification(allowedRoles)], nodesController.getAllNodes);

/* Get all reading averages of a node */
nodesRouter.get('/:nodeType/:nodeId/:lat/:long/:date/:variableType', nodesController.getReadingAverages);

/* Get range of reading averages of a node */
nodesRouter.get('/:nodeType/:nodeId/:lat/:long/:date/:variableType/range', nodesController.getAveragesRange);

// /* Add a node */
// nodesRouter.post(
//   '/',
//   [middleware.AccessTokenVerification],
//   nodesController.create,
// );

// /* Get all variables of a node */
// nodesRouter.get('/:nodeType/:nodeId/variables', nodesController.getVariables);

module.exports = nodesRouter;
