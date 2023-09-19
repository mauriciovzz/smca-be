const pool = require('../connections/database');

/* Get all locations */
const getAll = async (req, res) => {
  const sql = ` SELECT 
                  * 
                FROM
                  location`;

  const result = await pool.query(sql);
  res.send(result.rows);
};

/* Get a location */
const getOne = async (req, res) => {
  const { lat, long } = req.params;

  const sql = ` SELECT 
                  * 
                FROM 
                  location
                WHERE 
                  location.lat      = $1
                  AND location.long = $2`;

  const response = await pool.query(sql, [lat, long]);
  res.send(response.rows);
};

/* Add location */
const create = async (req, res) => {
  const {
    lat,
    long,
    locationName,
    locationAddress,
  } = req.body;

  const sql = ` INSERT INTO location
                VALUES ($1, $2, $3, $4)
                RETURNING *`;

  const response = await pool.query(sql, [lat, long, locationName, locationAddress]);
  return res.send(response.rows);
};

/* Update a location */
const update = async (req, res) => {
  const {
    lat, long, locationName, locationAddress,
  } = req.body;

  const sql = ` UPDATE 
                  location
                SET
                  location_name = $3,
                  location_address = $4
                WHERE 
                  location.lat      = $1
                  AND location.long = $2    
                RETURNING *`;

  const response = await pool.query(sql, [lat, long, locationName, locationAddress]);
  return res.send(response.rows);
};

/* Delete a location */
const remove = async (req, res) => {
  const { lat, long } = req.params;

  const sql = ` DELETE FROM 
                  location                
                WHERE 
                  location.lat      = $1
                  AND location.long = $2`;

  const response = await pool.query(sql, [lat, long]);
  return res.send(response.rows);
};
module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
