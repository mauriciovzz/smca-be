const pool = require('../connections/database');

/* Add a role */
const create = async (req, res) => {
  const { roleName } = req.body;

  const sql = ` INSERT INTO user_role (
                  role_name
                ) 
                VALUES ($1)
                RETURNING *`;

  const response = await pool.query(sql, [roleName]);
  res.status(201).send(response.rows);
};

module.exports = {
  create,
};
