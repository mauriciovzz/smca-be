const nodesRouter = require('express').Router();
const nodesController = require('../controllers/nodes');

/* Get all nodes */
nodesRouter.get('/', nodesController.getAll);

/* Add a node */
nodesRouter.post('/', async (req, res) => {
  const response = await nodesController.create(req.body);
  res.send(response);
});

/* Get all variables of a node */
nodesRouter.get('/:nodeType/:nodeId/variables', nodesController.getVariables);

module.exports = nodesRouter;
