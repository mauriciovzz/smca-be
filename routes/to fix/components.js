const componentsRouter = require('express').Router();
const componentsController = require('../../controllers/to fix/components');
const middleware = require('../../utils/middleware');

const allowedRoles = ['RESEARCHER', 'ADMIN'];

componentsRouter.get('/', [middleware.AccessTokenVerification(allowedRoles)], componentsController.getAll);

componentsRouter.post('/', [middleware.AccessTokenVerification(allowedRoles)], componentsController.create);

componentsRouter.put('/', [middleware.AccessTokenVerification(allowedRoles)], componentsController.update);

componentsRouter.delete('/:componentType/:componentId', [middleware.AccessTokenVerification(allowedRoles)], componentsController.remove);

module.exports = componentsRouter;
