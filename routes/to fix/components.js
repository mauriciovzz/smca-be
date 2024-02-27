const componentsRouter = require('express').Router();
const componentsController = require('../../controllers/to fix/components');
const middleware = require('../../utils/middleware');

const allowedRoles = ['RESEARCHER', 'ADMIN'];

componentsRouter.get('/', [middleware.accessTokenVerification(allowedRoles)], componentsController.getAll);

componentsRouter.post('/', [middleware.accessTokenVerification(allowedRoles)], componentsController.create);

componentsRouter.put('/', [middleware.accessTokenVerification(allowedRoles)], componentsController.update);

componentsRouter.delete('/:componentType/:componentId', [middleware.accessTokenVerification(allowedRoles)], componentsController.remove);

module.exports = componentsRouter;
