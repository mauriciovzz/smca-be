const pool = require('../connections/database');

/* Add component variable */
const create = async (req, res) => {
  const { componentId, variableId } = req.body;
  const sql = ` INSERT INTO component_variable 
                VALUES ($1, $2)
                RETURNING *`;

  const response = await pool.query(sql, [componentId, variableId]);
  res.send(response.rows);
};

module.exports = {
  create,
};
