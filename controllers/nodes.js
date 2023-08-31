const pool = require('../connections/database');

/* Get all nodes */
const getAll = async (req, res) => {
  const sql = ` SELECT 
                  * 
                FROM
                  node`;

  const response = await pool.query(sql);
  res.send(response.rows);
};

/* Add a node */
const create = async (reqBody) => {
  const { nodeType } = reqBody;

  const type = (nodeType === 'OUTDOOR') ? 'outdoor' : 'indoor';
  const sql = ` INSERT INTO node (
                  node_type, 
                  node_id
                ) 
                VALUES ($1, nextval('${type}_nodes'))
                RETURNING *`;

  const response = await pool.query(sql, [nodeType]);
  return response.rows;
};

/* Get all variables of a node */
const getVariables = async (req, res) => {
  const { nodeType, nodeId } = req.params;
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

  const response = await pool.query(sql, [nodeType, nodeId]);
  res.send(response.rows);
};

/* Get all variables of a node */
const deleteAll = async () => {
  const sql = ` DELETE FROM 
                  node`;

  await pool.query(sql);
};

module.exports = {
  getAll,
  create,
  getVariables,
  deleteAll,
};
