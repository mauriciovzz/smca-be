const locationsRouter = require('express').Router();
const locationsController = require('../controllers/locations');
const middleware = require('../utils/middleware');

/* Get all locations */
locationsRouter.get('/', locationsController.getAll);

/* Get a location */
locationsRouter.get('/:lat/:long', locationsController.getOne);

/* Add location */
locationsRouter.post(
  '/',
  [middleware.tokenVerification],
  locationsController.create,
);

/* Update a location */
locationsRouter.put(
  '/',
  [middleware.tokenVerification],
  locationsController.update,
);

/* Remove a location */
locationsRouter.delete(
  '/:lat/:long',
  [middleware.tokenVerification],
  locationsController.remove,
);

module.exports = locationsRouter;
