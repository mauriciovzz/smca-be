const nodeComponentsRouter = require('express').Router();
const nodeComponentsController = require('../controllers/node_components');

/* Add component variable */
nodeComponentsRouter.post('/', nodeComponentsController.create);

module.exports = nodeComponentsRouter;
