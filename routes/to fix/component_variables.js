const componentVariablesRouter = require('express').Router();
const componentVariablesController = require('../../controllers/to fix/component_variables');

/* Add component variable */
componentVariablesRouter.post('/', componentVariablesController.create);

module.exports = componentVariablesRouter;
