const averageReadingsRouter = require('express').Router();
const averageReadingsController = require('../controllers/average_readings');

/* Get all average readings of a node variable on a given day */
averageReadingsRouter.get('/:nodeType/:nodeId/:variableId/:date', averageReadingsController.getAll);

module.exports = averageReadingsRouter;
