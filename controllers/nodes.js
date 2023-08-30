const nodesRouter = require('express').Router();
const pool = require('../connections/database');

/* Get all nodes */
nodesRouter.get('/', async (req, res) => {
  const sql = ` SELECT 
                  * 
                FROM
                  node`;

  const response = await pool.query(sql);
  res.send(response.rows);
});

/* Add a node */
nodesRouter.post('/', async (req, res) => {
  const { nodeType } = req.body;

  const type = (nodeType === 'OUTDOOR') ? 'outdoor' : 'indoor';
  const sql = ` INSERT INTO node (
                  node_type, 
                  node_id
                ) 
                VALUES ($1, nextval('${type}_nodes'))
                RETURNING *`;

  const response = await pool.query(sql, [nodeType]);
  res.send(response.rows);
});

module.exports = nodesRouter;
