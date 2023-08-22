const componentVariablesRouter = require('express').Router()
const pool = require('../database/db')

/* Add component variable*/ 
componentVariablesRouter.post('/', async (req, res, next) => {
  const { component_id, variable_id } = req.body;
  const sql = ` INSERT INTO component_variable 
                VALUES ($1, $2)
                RETURNING *`

  const response = await pool.query(sql, [component_id, variable_id]);  
  res.send(response.rows);
});

module.exports = componentVariablesRouter