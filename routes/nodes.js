const nodesRouter = require('express').Router();
const nodesController = require('../controllers/nodes');

/* Get all nodes */
nodesRouter.get('/', nodesController.getAll);

/* Add a node */
nodesRouter.post('/', nodesController.create);

/* Get all variables of a node */
nodesRouter.get('/:nodeType/:nodeId/variables', nodesController.getVariables);

module.exports = nodesRouter;
