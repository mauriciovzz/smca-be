const readingsRouter = require('express').Router()
const pool = require('../database/db')

/* Add a reading */
readingsRouter.get('/', async (req, res, next) => {
  const { node_type, node_id, variable_id,  reading_date, reading_time, reading_value } = req.body
  
  const response = await pool.query(` INSERT INTO reading (node_type, node_id, variable_id,  reading_date, reading_time, reading_value)
                                      VALUES ($1, $2, $3, $4, $5, $6)
                                      RETURNING *`, [node_type, node_id, variable_id,  reading_date, reading_time, reading_value]);

    res.send(response.rows)
});

module.exports = readingsRouter
