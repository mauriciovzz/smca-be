const averageReadingsRouter = require('express').Router();
const pool = require('../database/db');

/* Get all average readings of a node variable on a given day */
averageReadingsRouter.get('/:nodeType/:nodeId/:variableId/:date', async (req, res) => {
  const {
    nodeType,
    nodeId,
    variableId,
    date,
  } = req.params;

  const sql = ` SELECT 
                  end_hour, 
                  average_value
                FROM 
                  average_reading
                WHERE 
                  node_type       = $1
                  AND node_id     = $2
                  AND variable_id = $3
                  AND date        = $4 `;

  const response = await pool.query(sql, [nodeType, nodeId, variableId, date]);
  res.send(response.rows);
});

module.exports = averageReadingsRouter;
