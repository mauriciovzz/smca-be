const pool = require('../utils/databaseHelper');

const create = async (accountId, name, color) => {
  const sql = ` INSERT INTO workspace (
                  name,
                  color
                ) 
                VALUES ($1, $2)
                RETURNING workspace_id`;
  const response = await pool.query(sql, [name, color]);
  return response.rows[0];
};

const getAll = async (accountId) => {
  const sql = ` SELECT 
                  w.workspace_id,
                  w.name,
                  w.color,
                  (SELECT count(*) FROM workspace_account WHERE workspace_id = w.workspace_id) AS members,
                  (SELECT count(*) FROM node WHERE workspace_id = w.workspace_id) AS nodes,
                  wa.is_admin
                FROM
                  workspace w,
                  workspace_account wa
                WHERE
                  w.workspace_id = wa.workspace_id
                  AND wa.account_id = $1
                ORDER BY workspace_id`;

  const response = await pool.query(sql, [accountId]);
  return response.rows;
};

const getOne = async (workspaceId) => {
  const sql = ` SELECT 
                  *
                FROM
                  workspace
                WHERE
                  workspace_id = $1`;
  const response = await pool.query(sql, [workspaceId]);

  return response.rows[0];
};

const getMembers = async (workspaceId) => {
  const sql = ` SELECT 
                  ac.account_id,
                  ac.first_name,
                  ac.last_name,
                  ac.email,
                  wa.is_admin
                FROM
                  workspace w,
                  workspace_account wa,
                  account ac
                WHERE
                  w.workspace_id = $1
                  AND w.workspace_id = wa.workspace_id
                  AND wa.account_id = ac.account_id
                ORDER BY ac.last_name ASC, ac.first_name ASC, ac.email ASC`;
  const response = await pool.query(sql, [workspaceId]);
  return response.rows;
};

const getInvitations = async (accountId) => {
  const sql = ` SELECT
                  wi.workspace_id,
                  w.name,
                  ac.first_name,
                  ac.last_name
                FROM
                  workspace_invitation wi,
                  workspace w,
                  account ac
                WHERE
                  wi.invited_account_id = $1
                  AND wi.workspace_id = w.workspace_id
                  AND wi.inviter_account_id = ac.account_id
                ORDER BY w.workspace_id`;

  const response = await pool.query(sql, [accountId]);
  return response.rows;
};

const invitationCreation = async (workspaceId, inviterAccountId, invitedAccountId) => {
  const sql = ` INSERT INTO workspace_invitation (
                  workspace_id,
                  inviter_account_id,
                  invited_account_id
                ) 
                VALUES ($1, $2, $3)`;
  await pool.query(sql, [workspaceId, inviterAccountId, invitedAccountId]);
};

const isWorkspaceAdmin = async (workspaceId, accountId) => {
  const sql = ` SELECT 
                  is_admin
                FROM
                  workspace_account
                WHERE
                  workspace_id = $1
                  AND account_id = $2`;
  const response = await pool.query(sql, [workspaceId, accountId]);

  return response.rows[0].is_admin;
};

const isInWorkspace = async (workspaceId, accountId) => {
  const sql = ` SELECT 
                  *
                FROM
                  workspace_account
                WHERE
                  workspace_id = $1
                  AND account_id = $2`;
  const response = await pool.query(sql, [workspaceId, accountId]);

  return response.rows[0];
};

const findInvitation = async (workspaceId, invitedAccountId) => {
  const sql = ` SELECT
                  * 
                FROM
                  workspace_invitation 
                WHERE
                  workspace_id = $1
                  AND invited_account_id = $2`;
  const response = await pool.query(sql, [workspaceId, invitedAccountId]);
  return response.rows[0];
};

const invitationRemoval = async (workspaceId, invitedAccountId) => {
  const sql = ` DELETE FROM
                  workspace_invitation 
                WHERE
                  workspace_id = $1
                  AND invited_account_id = $2`;
  await pool.query(sql, [workspaceId, invitedAccountId]);
};

const addMember = async (workspaceId, accountId, isAdmin) => {
  const sql = ` INSERT INTO workspace_account (
                  workspace_id,
                  account_id,
                  is_admin
                ) 
                VALUES ($1, $2, $3)`;
  await pool.query(sql, [workspaceId, accountId, isAdmin]);
};

const updateColumn = async (column, workspaceId, newValue) => {
  const sql = ` UPDATE
                  workspace
                SET
                  ${column} = $1
                WHERE
                  workspace_id = $2`;
  await pool.query(sql, [newValue, workspaceId]);
};

const memberRoleUpdate = async (workspaceId, accountId, isAdmin) => {
  const sql = ` UPDATE
                  workspace_account 
                SET
                  is_admin = $1
                WHERE
                  workspace_id = $2
                  AND account_id = $3`;
  await pool.query(sql, [isAdmin, workspaceId, accountId]);
};

const memberRemoval = async (workspaceId, accountId) => {
  const sql = ` DELETE FROM 
                  workspace_account
                WHERE
                  workspace_id = $1
                  AND account_id = $2`;
  await pool.query(sql, [workspaceId, accountId]);
};

const getAdminCount = async (workspaceId) => {
  const sql = ` SELECT 
                  COUNT(account_id) as admins
                FROM
                  workspace_account
                WHERE
                  workspace_id = $1
                  AND is_admin = true`;
  const response = await pool.query(sql, [workspaceId]);

  return parseInt(response.rows[0].admins, 10);
};

const deleteWorkspace = async (workspaceId) => {
  const sql = ` DELETE FROM 
                  workspace
                WHERE
                  workspace_id = $1`;
  await pool.query(sql, [workspaceId]);
};

module.exports = {
  create,
  getAll,
  getOne,
  getMembers,
  getInvitations,
  invitationCreation,
  isWorkspaceAdmin,
  isInWorkspace,
  findInvitation,
  invitationRemoval,
  addMember,
  updateColumn,
  memberRoleUpdate,
  memberRemoval,
  getAdminCount,
  deleteWorkspace,
};
