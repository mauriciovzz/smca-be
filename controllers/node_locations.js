const pool = require('../connections/database');

/* Get all node locations */
const getAll = async (req, res) => {
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
};

/* Get a node location */
const getOne = async (req, res) => {
  const {
    lat,
    long,
    nodeType,
    nodeId,
  } = req.params;

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

  const response = await pool.query(sql, [lat, long, nodeType, nodeId]);
  res.send(response.rows);
};

/* Add node location */
const create = async (req, res) => {
  const {
    nodeType,
    nodeId,
    lat,
    long,
    startDate,
    startTime,
  } = req.body;
  const isCurrentLocation = true;

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

  const response = await pool.query(
    sql,
    [nodeType, nodeId, lat, long, startDate, startTime, isCurrentLocation],
  );
  res.send(response.rows);
};

module.exports = {
  getAll,
  getOne,
  create,
};
