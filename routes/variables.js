const variablesRouter = require('express').Router();
const variablesController = require('../controllers/variables');

/* Add variable */
variablesRouter.post('/', variablesController.create);

module.exports = variablesRouter;
