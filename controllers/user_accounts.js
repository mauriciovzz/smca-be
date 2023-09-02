const bcrypt = require('bcrypt');
const pool = require('../connections/database');

/* Add an user */
const create = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    roleId,
  } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const sql = ` INSERT INTO user_account (
                  first_name,
                  last_name,
                  email,
                  password, 
                  role_id
                ) 
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`;

  const response = await pool.query(sql, [firstName, lastName, email, passwordHash, roleId]);
  res.status(201).send(response.rows);
};

module.exports = {
  create,
};
