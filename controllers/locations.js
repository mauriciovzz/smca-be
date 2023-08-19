const locationsRouter = require('express').Router()
const pool = require('../database/db')

/* Get all locations */
locationsRouter.get('/', async (req, res, next) => {
	const result = await pool.query('SELECT * FROM location')

	res.send(result.rows)
});

/* Get a location */
locationsRouter.get('/:lat/:long', async (req, res, next) => {
  const { lat, long } = req.params;

  const response = await pool.query('SELECT * FROM location WHERE location.lat = $1 AND location.long = $2', [lat,long]);

  res.send(response.rows);
});

/* Add location*/ 
locationsRouter.post('/', async (req, res, next) => {
	const { lat, long, location_name, location_address } = req.body;
	
  const response = pool.query('INSERT INTO location VALUES ($1, $2, $3, $4) RETURNING *', [lat, long, location_name, location_address])

  res.send(response.rows);
});

module.exports = locationsRouter