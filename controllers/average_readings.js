const averageReadingsRouter = require('express').Router()
const pool = require('../database/db')

/* Get all values of a node */
averageReadingsRouter.get('/:node_type/:node_id/:variable_id/:date', async (req, res, next) => {
  const { node_type, node_id, variable_id, date } = req.body
  const sql = ` SELECT 
                  end_hour, 
                  average_value
                FROM 
                  average_reading
                WHERE 
                  node_type       = $1
                  AND node_id     = $2
                  AND variable_id = $3
                  AND date        = $4 `
  
  const response = await pool.query(sql, [node_type, node_id, variable_id, date]);
  res.send(response.rows);
});

module.exports = averageReadingsRouter
