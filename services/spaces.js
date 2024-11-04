const pool = require('../config/db');

const create = async (name, color) => {
  const sql = ` INSERT INTO space (
                  name,
                  color
                ) 
                VALUES ($1, $2)
                RETURNING space_id`;

  const response = await pool.query(sql, [name, color]);
  return response.rows[0];
};

// (SELECT count(*) FROM node WHERE space_id = s.space_id) AS nodes,

const getAll = async (accountId) => {
  const sql = ` SELECT 
                  s.space_id,
                  s.name,
                  s.color,
                  (SELECT count(*) FROM space_member WHERE space_id = s.space_id) AS members,
                  sm.is_admin
                FROM
                  space s,
                  space_member sm
                WHERE
                  s.space_id = sm.space_id
                  AND sm.account_id = $1
                ORDER BY s.space_id`;

  const response = await pool.query(sql, [accountId]);
  return response.rows;
};

const getOne = async (spaceId, accountId) => {
  const sql = ` SELECT 
                  s.space_id,
                  s.name,
                  s.color,
                  sm.is_admin
                FROM
                  space s,
                  space_member sm
                WHERE
                  s.space_id = $1
                  AND s.space_id = sm.space_id
                  AND sm.account_id = $2`;

  const response = await pool.query(sql, [spaceId, accountId]);
  return response.rows[0];
};

const find = async (spaceId) => {
  const sql = ` SELECT 
                  space_id
                FROM
                  space
                WHERE
                  space_id = $1`;

  const response = await pool.query(sql, [spaceId]);
  return response.rows[0];
};

const isMember = async (spaceId, accountId) => {
  const sql = ` SELECT EXISTS (
                  SELECT 
                    true
                  FROM
                    space_member 
                  WHERE 
                    space_id = $1
                    AND account_id = $2
                )`;

  const response = await pool.query(sql, [spaceId, accountId]);
  return response.rows[0].exists;
};

const isAdmin = async (spaceId, accountId) => {
  const sql = ` SELECT
                  is_admin
                FROM
                  space_member
                WHERE
                  space_id = $1
                  AND account_id = $2`;

  const response = await pool.query(sql, [spaceId, accountId]);

  return (response.rows.length !== 0)
    ? response.rows[0].is_admin
    : false;
};

const updateName = async (spaceId, newName) => {
  const sql = ` UPDATE
                  space
                SET
                  name = $2
                WHERE
                  space_id = $1`;

  await pool.query(sql, [spaceId, newName]);
};

const updateColor = async (spaceId, newColor) => {
  const sql = ` UPDATE
                  space
                SET
                  color = $2
                WHERE
                  space_id = $1`;

  await pool.query(sql, [spaceId, newColor]);
};

const getAdminCount = async (spaceId) => {
  const sql = ` SELECT
                  COUNT(account_id) as admins
                FROM
                  space_member
                WHERE
                  space_id = $1
                  AND is_admin = true`;

  const response = await pool.query(sql, [spaceId]);
  return parseInt(response.rows[0].admins, 10);
};

const remove = async (spaceId) => {
  const sql = ` DELETE FROM
                  space
                WHERE
                  space_id = $1`;

  await pool.query(sql, [spaceId]);
};

module.exports = {
  create,
  getAll,
  getOne,
  find,
  isAdmin,
  isMember,
  updateName,
  updateColor,
  getAdminCount,
  remove,
};
