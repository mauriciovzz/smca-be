const nodeLocationsRouter = require('express').Router();
const nodeLocationsController = require('../../controllers/to fix/node_locations');

/* Get all node locations */
nodeLocationsRouter.get('/', nodeLocationsController.getAll);

/* Get a node location */
nodeLocationsRouter.get('/:lat/:long/:nodeType/:nodeId', nodeLocationsController.getOne);

/* Add node location */
nodeLocationsRouter.post('/', nodeLocationsController.create);

module.exports = nodeLocationsRouter;
