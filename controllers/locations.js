const locationsRouter = require('express').Router();
const pool = require('../database/db');

/* Get all locations */
locationsRouter.get('/', async (req, res) => {
  const sql = ` SELECT 
                  * 
                FROM
                  location`;

  const result = await pool.query(sql);
  res.send(result.rows);
});

/* Get a location */
locationsRouter.get('/:lat/:long', async (req, res) => {
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
});

/* Add location */
locationsRouter.post('/', async (req, res) => {
  const {
    lat,
    long,
    locationName,
    locationAddress,
  } = req.body;

  console.log(lat, long, locationName, locationAddress);

  const sql = ` INSERT INTO location 
                VALUES ($1, $2, $3, $4)
                RETURNING *`;

  const response = pool.query(sql, [lat, long, locationName, locationAddress]);
  res.send(response.rows);
});

module.exports = locationsRouter;
