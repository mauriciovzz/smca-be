const locationsRouter = require('express').Router();
const locationsController = require('../controllers/locations');

/* Get all locations */
locationsRouter.get('/', locationsController.getAll);

/* Get a location */
locationsRouter.get('/:lat/:long', locationsController.getOne);

/* Add location */
locationsRouter.post('/', locationsController.create);

module.exports = locationsRouter;
