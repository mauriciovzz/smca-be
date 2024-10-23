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

const addMember = async (spaceId, accountId, isAdmin) => {
  const sql = ` INSERT INTO space_member (
                  space_id,
                  account_id,
                  is_admin
                ) 
                VALUES ($1, $2, $3)`;

  await pool.query(sql, [spaceId, accountId, isAdmin]);
};

const getAll = async (accountId) => {
  const sql = ` SELECT 
                  s.space_id,
                  s.name,
                  s.color,
                  (SELECT count(*) FROM space_member WHERE space_id = s.space_id) AS members,
                  (SELECT count(*) FROM node WHERE space_id = s.space_id) AS nodes,
                  sm.is_admin
                FROM
                  space s,
                  space_member sm
                WHERE
                  s.space_id = sm.space_id
                  AND sm.account_id = $1
                ORDER BY space_id`;

  const response = await pool.query(sql, [accountId]);
  return response.rows;
};

const find = async (spaceId) => {
  const sql = ` SELECT 
                  *
                FROM
                  space
                WHERE
                  space_id = $1`;

  const response = await pool.query(sql, [spaceId]);
  return response.rows[0];
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

const removeMember = async (spaceId, accountId) => {
  const sql = ` DELETE FROM
                  space_member
                WHERE
                  space_id = $1
                  AND account_id = $2`;

  const response = await pool.query(sql, [spaceId, accountId]);
  return response;
};

const remove = async (spaceId) => {
  const sql = ` DELETE FROM
                  space
                WHERE
                  space_id = $1`;

  await pool.query(sql, [spaceId]);
};

const findInvitation = async (spaceId, inviteeAccountId) => {
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

const createInvitation = async (spaceId, inviteeAccountId, inviterAccountId) => {
  const sql = ` INSERT INTO space_invitation (
                  space_id,
                  invitee_account_id,
                  inviter_account_id
                )
                VALUES ($1, $2, $3)`;

  await pool.query(sql, [spaceId, inviteeAccountId, inviterAccountId]);
};

const getInvitations = async (accountId) => {
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

const removeInvitation = async (spaceId, inviteeAccountId) => {
  const sql = ` DELETE FROM
                  space_invitation
                WHERE
                  space_id = $1
                  AND invitee_account_id = $2`;

  await pool.query(sql, [spaceId, inviteeAccountId]);
};

const getMembers = async (spaceId) => {
  const sql = ` SELECT
                  ac.account_id,
                  ac.first_name,
                  ac.last_name,
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

const memberRoleUpdate = async (spaceId, accountId) => {
  const sql = ` UPDATE
                  space_member
                SET
                  is_admin = NOT is_admin
                WHERE
                  space_id = $1
                  AND account_id = $2`;

  await pool.query(sql, [spaceId, accountId]);
};

module.exports = {
  create,
  addMember,
  getAll,
  find,
  isAdmin,
  updateName,
  updateColor,
  isMember,
  getAdminCount,
  removeMember,
  remove,
  findInvitation,
  createInvitation,
  getInvitations,
  removeInvitation,
  getMembers,
  memberRoleUpdate,
};
