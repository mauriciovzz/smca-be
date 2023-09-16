const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../connections/database');
const config = require('../utils/config');

/* Add an user */
const create = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
  } = req.body;
  const roleId = 2;

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
  return res.status(201).send(response.rows);
};

/* Login */
const login = async (req, res) => {
  const { email, password } = req.body;

  const userQuery = await pool.query('SELECT * FROM user_account WHERE email = $1', [email]);
  const user = (userQuery.rows[0]) ? userQuery.rows[0] : null;

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    email: user.email,
    id: user.user_id,
  };

  // token expires in one hour
  const token = jwt.sign(
    userForToken,
    config.SECRET,
    { expiresIn: 60 * 60 },
  );

  return res
    .status(200)
    .send({
      token,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });
};

module.exports = {
  create,
  login,
};
