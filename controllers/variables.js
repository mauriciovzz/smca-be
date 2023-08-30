const pool = require('../connections/database');

/* Add variable */
const create = async (req, res) => {
  const { variableType, variableName, variableUnit } = req.body;
  const sql = ` INSERT INTO variable (
                  variable_type, 
                  variable_name, 
                  variable_unit
                ) 
                VALUES ($1, $2, $3)
                RETURNING *`;

  const response = await pool.query(sql, [variableType, variableName, variableUnit]);
  res.send(response.rows);
};

module.exports = {
  create,
};
