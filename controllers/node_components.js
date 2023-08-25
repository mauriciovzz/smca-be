const nodeComponentsRouter = require('express').Router();
const pool = require('../database/db');

/* Add component variable */
nodeComponentsRouter.post('/', async (req, res) => {
  const { nodeType, nodeId, componentId } = req.body;
  const sql = ` INSERT INTO node_component 
                VALUES ($1, $2, $3)
                RETURNING *`;

  const response = await pool.query(sql, [nodeType, nodeId, componentId]);
  res.send(response.rows);
});

module.exports = nodeComponentsRouter;
