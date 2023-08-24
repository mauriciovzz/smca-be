const variablesRouter = require('express').Router();
const pool = require('../database/db');

/* Get all variables of a node */
variablesRouter.get('/:node_type/:node_id', async (req, res) => {
  const { node_type, node_id } = req.params;
  const sql = ` SELECT 
                  *
                FROM 
                  variable 
                JOIN 
                  component_variable
                ON 
                  variable.variable_id = component_variable.variable_id
                JOIN 
                  node_component
                ON 
                  component_variable.component_id = node_component.component_id
                WHERE 	
                  node_component.node_type    = $1
                  AND node_component.node_id  = $2`;

  const response = await pool.query(sql, [node_type, node_id]);
  res.send(response.rows);
});

/* Add variable*/
variablesRouter.post('/', async (req, res) => {
  const { variable_type, variable_name, variable_unit } = req.body;
  const sql = `	INSERT INTO variable (
                  variable_type, 
                  variable_name, 
                  variable_unit
                ) 
                VALUES ($1, $2, $3)
                RETURNING *`;

  const response = await pool.query(sql , [variable_type, variable_name, variable_unit]);
  res.send(response.rows);
});

module.exports = variablesRouter;