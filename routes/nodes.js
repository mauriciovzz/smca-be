const nodesRouter = require('express').Router();
const nodesController = require('../controllers/nodes');

/* Get all nodes */
nodesRouter.get('/', nodesController.getAll);

/* Add a node */
nodesRouter.post('/', nodesController.create);

module.exports = nodesRouter;
