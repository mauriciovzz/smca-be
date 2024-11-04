const pool = require('../config/db');

const addMember = async (spaceId, accountId, isAdmin) => {
  const sql = ` INSERT INTO space_member (
                  space_id,
                  account_id,
                  is_admin
                ) 
                VALUES ($1, $2, $3)`;

  await pool.query(sql, [spaceId, accountId, isAdmin]);
};

const getAll = async (spaceId) => {
  const sql = ` SELECT
                  ac.account_id,
                  ac.first_name,
                  ac.last_name,
                  ac.email,
                  sa.is_admin
                FROM
                  space s,
                  space_member sa,
                  account ac
                WHERE
                  s.space_id = $1
                  AND s.space_id = sa.space_id
                  AND sa.account_id = ac.account_id
                ORDER BY ac.last_name ASC, ac.first_name ASC`;

  const response = await pool.query(sql, [spaceId]);
  return response.rows;
};

const updateMemberRole = async (spaceId, accountId) => {
  const sql = ` UPDATE
                  space_member
                SET
                  is_admin = NOT is_admin
                WHERE
                  space_id = $1
                  AND account_id = $2`;

  await pool.query(sql, [spaceId, accountId]);
};

const removeMember = async (spaceId, accountId) => {
  const sql = ` DELETE FROM
                  space_member
                WHERE
                  space_id = $1
                  AND account_id = $2`;

  const response = await pool.query(sql, [spaceId, accountId]);
  return response;
};

module.exports = {
  addMember,
  getAll,
  updateMemberRole,
  removeMember,
};
