const photosRouter = require('express').Router();
const photosController = require('../../controllers/to fix/photos');

/* Get a photo Path */
photosRouter.get('/:nodeType/:nodeId/:lat/:long/:photoDate', photosController.getDayPaths);

module.exports = photosRouter;
