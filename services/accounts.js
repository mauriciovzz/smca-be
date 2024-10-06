const pool = require('../config/db');

const create = async (firstName, lastName, email, passwordHash) => {
  const sql = ` INSERT INTO account (
                  first_name,
                  last_name,
                  email,
                  password_hash
                ) 
                VALUES ($1, $2, $3, $4)
                RETURNING account_id, first_name, last_name, email`;

  const response = await pool.query(sql, [firstName, lastName, email, passwordHash]);
  return response.rows[0];
};

const verify = async (accountId) => {
  const sql = ` UPDATE 
                  account
                SET
                  is_verified = true
                WHERE
                  account_id = $1`;

  await pool.query(sql, [accountId]);
};

const findByEmail = async (email) => {
  const sql = ` SELECT
                  *
                FROM
                  account
                WHERE
                  email = $1`;

  const response = await pool.query(sql, [email]);
  return response.rows[0];
};

const findById = async (accountId) => {
  const sql = ` SELECT
                  *
                FROM
                  account
                WHERE
                  account_id = $1`;

  const response = await pool.query(sql, [accountId]);
  return response.rows[0];
};

const updateName = async (accountId, firstName, lastName) => {
  const sql = ` UPDATE 
                  account
                SET
                  first_name = $2,
                  last_name = $3
                WHERE
                  account_id = $1`;

  await pool.query(sql, [accountId, firstName, lastName]);
};

const updatePassword = async (accountId, newPasswordHash) => {
  const sql = ` UPDATE 
                  account
                SET
                  password_hash = $2
                WHERE
                  account_id = $1`;

  await pool.query(sql, [accountId, newPasswordHash]);
};

const updateEmail = async (accountId, newEmail) => {
  const sql = ` UPDATE 
                  account
                SET
                  email = $2
                WHERE
                  account_id = $1`;

  await pool.query(sql, [accountId, newEmail]);
};

const remove = async (accountId) => {
  const sql = ` DELETE FROM 
                  account 
                WHERE
                  account_id = $1`;

  await pool.query(sql, [accountId]);
};

module.exports = {
  create,
  verify,
  findByEmail,
  findById,
  updateName,
  updatePassword,
  updateEmail,
  remove,
};
