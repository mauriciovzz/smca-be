const pool = require('../utils/databaseHelper');
const passwordProtection = require('../utils/passwordProtection');

const create = async (email, password, firstName, lastName) => {
  const sql = ` INSERT INTO account (
                  email,
                  password_hash,
                  first_name,
                  last_name
                ) 
                VALUES ($1, $2, $3, $4)`;

  const passwordHash = await passwordProtection.hashPassword(password);
  await pool.query(sql, [email, passwordHash, firstName, lastName]);
};

const findAccount = async (column, value) => {
  const accountQuery = await pool.query(`SELECT * FROM account WHERE ${column} = $1`, [value]);
  return accountQuery.rows[0];
};

const updateVerificationToken = async (
  email,
  verificationToken,
  verificationTokenExpiration,
) => {
  const sql = ` UPDATE account
                SET
                  verification_token = $1,
                  verification_token_expiration = to_timestamp($2 / 1000.0)
                WHERE
                  email = $3`;

  await pool.query(sql, [verificationToken, verificationTokenExpiration, email]);
};

const updatePassword = async (newPassword, accountId) => {
  const sql = ` UPDATE account
                SET
                  password_hash = $1,
                  verification_token = $2,
                  verification_token_expiration = $3
                WHERE account_id = $4`;
  const passwordHash = await passwordProtection.hashPassword(newPassword);
  await pool.query(sql, [passwordHash, undefined, undefined, accountId]);
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
  updateVerificationToken,
  updatePassword,
  updateName,
  updateEmail,
};
