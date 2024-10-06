const pool = require('../config/db');

const create = async (accountId, type, token, email, expiration) => {
  const sql = ` INSERT INTO verification_token (
                  account_id,
                  type,
                  token,
                  email,
                  expiration
                ) 
                VALUES ($1, $2, $3, $4, TO_TIMESTAMP($5))
                ON CONFLICT (account_id, type) 
                DO UPDATE SET
                  email = EXCLUDED.email,
                  token = EXCLUDED.token,
                  expiration = EXCLUDED.expiration`;

  await pool.query(sql, [accountId, type, token, email, expiration]);
};

const find = async (type, verificationToken) => {
  const sql = ` SELECT 
                  * 
                FROM
                  verification_token
                WHERE 
                  type = $1
                  AND token = $2`;

  const response = await pool.query(sql, [type, verificationToken]);
  return response.rows[0];
};

const remove = async (accountId, type) => {
  const sql = ` DELETE FROM
                  verification_token
                WHERE 
                  account_id = $1
                  AND type = $2`;

  await pool.query(sql, [accountId, type]);
};

module.exports = {
  create,
  find,
  remove,
};
