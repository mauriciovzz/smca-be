const nodeComponentsRouter = require('express').Router()
const pool = require('../database/db')

/* Add component variable*/ 
nodeComponentsRouter.post('/', async (req, res, next) => {
  const { node_type, node_id, component_id } = req.body;

  const response = await pool.query(` INSERT INTO node_component 
                                      VALUES ($1, $2, $3)
                                      RETURNING *`, [node_type, node_id, component_id]);
  
  res.send(response.rows);
});

module.exports = nodeComponentsRouter