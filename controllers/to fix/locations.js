const pool = require('../../utils/databaseHelper');

const getFree = async (req, res) => {
  const sql = ` SELECT 
                  * 
                FROM
                  location
                WHERE
                  taken=false`;

  const result = await pool.query(sql);
  res.send(result.rows);
};

const getAll = async (req, res) => {
  const sql = ` SELECT 
                  * 
                FROM
                  location`;

  const result = await pool.query(sql);
  res.send(result.rows);
};

const getOne = async (req, res) => {
  const { lat, long } = req.params;

  const sql = ` SELECT 
                  * 
                FROM 
                  location
                WHERE 
                  lat      = $1
                  AND long = $2`;

  const response = await pool.query(sql, [lat, long]);
  res.send(response.rows);
};

const create = async (req, res) => {
  const {
    coordenates,
    locationName,
    address,
  } = req.body;

  const sql = ` INSERT INTO location (lat, long, location_name, address, taken)
                VALUES ($1, $2, $3, $4, $5)`;

  await pool.query(sql, [coordenates.lat, coordenates.long, locationName, address, false]);
  return res.sendStatus(201);
};

const update = async (req, res) => {
  const {
    lat, long, locationName, address,
  } = req.body;

  const sql = ` UPDATE 
                  location
                SET
                  location_name = $3,
                  address       = $4
                WHERE 
                  location.lat      = $1
                  AND location.long = $2    
                RETURNING *`;

  const response = await pool.query(sql, [lat, long, locationName, address]);
  return res.send(response.rows);
};

const remove = async (req, res) => {
  const { lat, long } = req.params;

  const sql = ` DELETE FROM 
                  location                
                WHERE 
                  location.lat      = $1
                  AND location.long = $2`;

  await pool.query(sql, [lat, long]);
  return res.sendStatus(204);
};

module.exports = {
  getFree,
  getAll,
  getOne,
  create,
  update,
  remove,
};
