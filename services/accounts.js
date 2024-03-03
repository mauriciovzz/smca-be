const pool = require('../utils/databaseHelper');

const create = async (email, passwordHash, firstName, lastName) => {
  const sql = ` INSERT INTO account (
                  email,
                  password_hash,
                  first_name,
                  last_name
                ) 
                VALUES ($1, $2, $3, $4)
                RETURNING *`;
  const accountInfo = await pool.query(sql, [email, passwordHash, firstName, lastName]);
  return accountInfo.rows[0];
};

const findAccount = async (column, value) => {
  const accountQuery = await pool.query(`SELECT * FROM account WHERE ${column} = $1`, [value]);
  return accountQuery.rows[0];
};

const createVerificationToken = async (accountId, type, email, token, expiration) => {
  const sql = ` INSERT INTO verification_token (
                  account_id,
                  type,
                  email,
                  token,
                  expiration
                ) 
                VALUES ($1, $2, $3, $4, TO_TIMESTAMP($5))
                ON CONFLICT (account_id, type) 
                DO UPDATE SET
                  email = EXCLUDED.email,
                  token = EXCLUDED.token,
                  expiration = EXCLUDED.expiration`;

  await pool.query(sql, [accountId, type, email, token, expiration]);
};

const findVerificationToken = async (type, token) => {
  const sql = (`  SELECT 
                    * 
                  FROM
                    verification_token
                  WHERE 
                    type = $1
                    AND token = $2`);
  const verificationToken = await pool.query(sql, [type, token]);
  return verificationToken.rows[0];
};

const deleteVerificationToken = async (token) => {
  const sql = (`  DELETE FROM
                    verification_token
                  WHERE 
                    token = $1`);
  await pool.query(sql, [token]);
};

const verifyAccount = async (accountId) => {
  const sql = ` UPDATE 
                  account
                SET
                  is_verified = true
                WHERE
                  account_id = $1`;
  await pool.query(sql, [accountId]);
};

const updateName = async (firstName, lastName, accountId) => {
  const sql = ` UPDATE 
                  account
                SET
                  first_name = $1,
                  last_name = $2
                WHERE
                  account_id = $3`;
  await pool.query(sql, [firstName, lastName, accountId]);
};

const updatePassword = async (passwordHash, accountId) => {
  const sql = ` UPDATE account
                SET
                  password_hash = $1
                WHERE account_id = $2`;
  await pool.query(sql, [passwordHash, accountId]);
};

const updateEmail = async (email, accountId) => {
  const sql = ` UPDATE 
                  account
                SET
                  email = $1
                WHERE
                  account_id = $2`;
  await pool.query(sql, [email, accountId]);
};

module.exports = {
  create,
  findAccount,
  createVerificationToken,
  findVerificationToken,
  deleteVerificationToken,
  verifyAccount,
  updateName,
  updateEmail,
  updatePassword,
};
