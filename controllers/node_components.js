const nodeComponentsRouter = require('express').Router();
const pool = require('../database/db');

/* Add component variable*/
nodeComponentsRouter.post('/', async (req, res) => {
  const { node_type, node_id, component_id } = req.body;
  const sql = ` INSERT INTO node_component 
                VALUES ($1, $2, $3)
                RETURNING *`;

  const response = await pool.query(sql, [node_type, node_id, component_id]);
  res.send(response.rows);
});

module.exports = nodeComponentsRouter;