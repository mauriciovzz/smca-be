const componentsRouter = require('express').Router();
const pool = require('../connections/database');

/* Add component */
componentsRouter.post('/', async (req, res) => {
  const { componentName } = req.body;
  const sql = ` INSERT INTO component (
                  component_name
                ) 
                VALUES ($1)
                RETURNING *`;

  const response = await pool.query(sql, [componentName]);
  res.send(response.rows);
});

module.exports = componentsRouter;
