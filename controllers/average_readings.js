const averageReadingsRouter = require('express').Router()
const pool = require('../database/db')

let values = [
    10, 20, 30, 40, 50, 60, 72, 83, 90, 70,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 80,
    21, 22, 23, 24
  ]

/* Get all values of a node */
averageReadingsRouter.get('/:node_type/:node_id/:variable_id/:date', async (req, res, next) => {
  const { node_type, node_id, variable_id, date } = req.body
  
  const response = await pool.query(` SELECT end_hour, average_value
                                      FROM average_reading
                                      WHERE 	node_type = $1
                                        AND node_id     = $2
                                        AND variable_id = $3
                                        AND date        = $4 `, [node_type, node_id, variable_id, date]);

  res.send(response.rows);
  //res.json(values)
});

module.exports = averageReadingsRouter
