const readingsRouter = require('express').Router()
const pool = require('../database/db')

/* Add a reading */
readingsRouter.get('/', async (req, res) => {
  const { node_type, node_id, variable_id, reading_date, reading_time, reading_value } = req.body
  const sql = ` INSERT INTO 
                  reading (
                    node_type, 
                    node_id, 
                    variable_id,  
                    reading_date, 
                    reading_time, 
                    reading_value
                  )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`
  
  const response = await pool.query(sql, [node_type, node_id, variable_id, reading_date, reading_time, reading_value]);
  console.log(response.rows)
});

module.exports = readingsRouter
