const pool = require('../config/db');

const create = async (spaceId, inviteeAccountId, inviterAccountId) => {
  const sql = ` INSERT INTO space_invitation (
                  space_id,
                  invitee_account_id,
                  inviter_account_id
                )
                VALUES ($1, $2, $3)`;

  await pool.query(sql, [spaceId, inviteeAccountId, inviterAccountId]);
};

const getAll = async (accountId) => {
  const sql = ` SELECT
                  si.space_id,
                  s.name,
                  ac.first_name,
                  ac.last_name
                FROM
                  space_invitation si,
                  space s,
                  account ac
                WHERE
                  si.invitee_account_id = $1
                  AND si.space_id = s.space_id
                  AND si.inviter_account_id = ac.account_id
                ORDER BY s.space_id`;

  const response = await pool.query(sql, [accountId]);
  return response.rows;
};

const find = async (spaceId, inviteeAccountId) => {
  const sql = ` SELECT EXISTS (
                  SELECT 
                    true
                  FROM
                    space_invitation 
                  WHERE 
                    space_id = $1
                    AND invitee_account_id = $2
                )`;

  const response = await pool.query(sql, [spaceId, inviteeAccountId]);
  return response.rows[0].exists;
};

const remove = async (spaceId, inviteeAccountId) => {
  const sql = ` DELETE FROM
                  space_invitation
                WHERE
                  space_id = $1
                  AND invitee_account_id = $2`;

  await pool.query(sql, [spaceId, inviteeAccountId]);
};

module.exports = {
  create,
  getAll,
  find,
  remove,
};
