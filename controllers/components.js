const pool = require('../connections/database');

/* Add component */
const create = async (req, res) => {
  const { componentName } = req.body;
  const sql = ` INSERT INTO component (
                  component_name
                ) 
                VALUES ($1)
                RETURNING *`;

  const response = await pool.query(sql, [componentName]);
  res.send(response.rows);
};

module.exports = {
  create,
};
