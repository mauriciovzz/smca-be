const locationsRouter = require('express').Router();
const locationsController = require('../../controllers/to fix/locations');
const middleware = require('../../utils/middleware');

const allowedRoles = ['RESEARCHER', 'ADMIN'];

/* Get all free locations */
locationsRouter.get('/free', [middleware.AccessTokenVerification(allowedRoles)], locationsController.getFree);

/* Get all locations */
locationsRouter.get('/', locationsController.getAll);

/*  Get a location */
locationsRouter.get('/:lat/:long', locationsController.getOne);

/* Add location */
locationsRouter.post('/', [middleware.AccessTokenVerification(allowedRoles)], locationsController.create);

/* Update a location */
locationsRouter.put('/', [middleware.AccessTokenVerification(allowedRoles)], locationsController.update);

/* Remove a location */
locationsRouter.delete('/:lat/:long', [middleware.AccessTokenVerification(allowedRoles)], locationsController.remove);

module.exports = locationsRouter;
