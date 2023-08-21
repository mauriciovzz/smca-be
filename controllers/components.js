const componentsRouter = require('express').Router()
const pool = require('../database/db')

/* Add component*/ 
componentsRouter.post('/', async (req, res, next) => {
  const { component_name } = req.body;

  const response = await pool.query(` INSERT INTO component (component_name) 
                                      VALUES ($1)
                                      RETURNING *`, [component_name]);
  
  res.send(response.rows);
});

module.exports = componentsRouter