const nodeComponentsRouter = require('express').Router();
const nodeComponentsController = require('../../controllers/to fix/node_components');

/* Add component variable */
nodeComponentsRouter.post('/', nodeComponentsController.create);

module.exports = nodeComponentsRouter;
