const readingsRuter = require('express').Router();
const averageReadingsController = require('../controllers/readings');

readingsRuter.get(
  '/:nodeType/:nodeId/:variableId/:date',
  averageReadingsController.getAll,
);

module.exports = readingsRuter;
