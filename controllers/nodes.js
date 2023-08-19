const nodesRouter = require('express').Router()
const pool = require('../database/db')
  
/* Get all nodes */
nodesRouter.get('/', async (req, res, next) => {
	const response = await pool.query('SELECT * FROM node')

	res.send(response.rows)
});

/* Add node*/ 
nodesRouter.post('/', async (req, res, next) => {
	const { node_type } = req.body;

	if (node_type === "INDOOR") {
		const response = await pool.query('INSERT INTO node (node_type, node_id) VALUES ($1, nextval(\'indoor_nodes\')) RETURNING *', [node_type]);
		res.send(response.rows);
	} else if (node_type === "OUTDOOR") {		
		const response = await pool.query('INSERT INTO node (node_type, node_id) VALUES ($1, nextval(\'outdoor_nodes\')) RETURNING *', [node_type]);
		res.send(response.rows)
	} 
});

module.exports = nodesRouter

