const nodesRouter = require('express').Router();
const pool = require('../database/db');

/* Get all nodes */
nodesRouter.get('/', async (req, res) => {
  const sql = `	SELECT 
                  * 
                 FROM
                  node`;

  const response = await pool.query(sql);
  res.send(response.rows);
});

/* Add a node*/
nodesRouter.post('/', async (req, res) => {
  const { node_type } = req.body;

  if (node_type === 'INDOOR') {
    const sql = `	INSERT INTO node (
                    node_type, 
                    node_id
                  ) 
                   VALUES ($1, nextval('indoor_nodes'))
                   RETURNING *`;

    const response = await pool.query(sql, [node_type]);
    res.send(response.rows);
  } else if (node_type === 'OUTDOOR') {
    const sql = `	INSERT INTO node (
                    node_type, 
                    node_id
                  ) 
                   VALUES ($1, nextval('indoor_nodes'))
                   RETURNING *`;

    const response = await pool.query(sql, [node_type]);
    res.send(response.rows);
  }
});

module.exports = nodesRouter;

