const nodeLocationsRouter = require('express').Router();
const pool = require('../database/db');

/* Get all node locations */
nodeLocationsRouter.get('/', async (req, res) => {
  const sql = ` SELECT 
                  node_type, 
                  node_id, 
                  lat, 
                  long, 
                  to_char("start_date", 'DD/MM/YYYY') AS start_date, 
                  start_time,
                  to_char("end_date", 'DD/MM/YYYY') AS end_date, 
                  end_time, 
                  is_current_location
                FROM 
                  node_location 
                WHERE 
                  node_location.is_current_location = true`;

  const response = await pool.query(sql);
  res.send(response.rows);
});

/* Get a node location */
nodeLocationsRouter.get('/:lat/:long/:node_type/:node_id', async (req, res) => {
  const { lat, long, node_type, node_id } = req.params;
  const sql = ` SELECT 
                  node_type, 
                  node_id, 
                  lat, 
                  long, 
                  to_char("start_date", 'DD/MM/YYYY') AS start_date, 
                  start_time,
                  to_char("end_date", 'DD/MM/YYYY') AS end_date, 
                  end_time, 
                  is_current_location
                FROM 
                  node_location 
                WHERE 
                  node_location.lat           = $1 
                  AND node_location.long      = $2
                  AND node_location.node_type = $3
                  AND node_location.node_id   = $4`;

  const response = await pool.query(sql , [lat, long, node_type, node_id]);
  res.send(response.rows);
});

/* Add node location */
nodeLocationsRouter.post('/', async (req, res) => {
  const { node_type, node_id, lat, long, start_date, start_time } = req.body;
  const is_current_location = true;
  const sql = ` INSERT INTO node_location (
                  node_type, 
                  node_id, 
                  lat, 
                  long, 
                  start_date, 
                  start_time, 
                  is_current_location
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *`;

  const response = pool.query(sql, [node_type, node_id, lat, long, start_date, start_time, is_current_location]);
  res.send(response.rows);
});

module.exports = nodeLocationsRouter;