const variablesRouter = require('express').Router();
const variablesController = require('../../controllers/to fix/variables');
const middleware = require('../../utils/middleware');

const allowedRoles = ['RESEARCHER', 'ADMIN'];

variablesRouter.get('/', [middleware.AccessTokenVerification(allowedRoles)], variablesController.getAll);

variablesRouter.post('/', [middleware.AccessTokenVerification(allowedRoles)], variablesController.create);

variablesRouter.put('/', [middleware.AccessTokenVerification(allowedRoles)], variablesController.update);

variablesRouter.delete('/:variableId', [middleware.AccessTokenVerification(allowedRoles)], variablesController.remove);

module.exports = variablesRouter;
