const nodesRouter = require('express').Router();
const nodesController = require('../controllers/nodes');
const middleware = require('../utils/middleware');

/* Get all nodes */
nodesRouter.get('/', nodesController.getAll);

/* Add a node */
nodesRouter.post(
  '/',
  [middleware.tokenVerification],
  nodesController.create,
);

/* Get all variables of a node */
nodesRouter.get('/:nodeType/:nodeId/variables', nodesController.getVariables);

module.exports = nodesRouter;
