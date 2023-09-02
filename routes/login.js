const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../connections/database');

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const userQuery = await pool.query('SELECT * FROM user_account WHERE email = $1', [email]);
  const user = userQuery.rows[0];

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

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
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
});

module.exports = loginRouter;
