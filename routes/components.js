const componentsRouter = require('express').Router();
const componentsController = require('../controllers/components');

/* Add component */
componentsRouter.post('/', componentsController.create);

module.exports = componentsRouter;
