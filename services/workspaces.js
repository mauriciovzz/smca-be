const pool = require('../utils/databaseHelper');

const addAccount = async (workspaceId, accountId, isAdmin) => {
  const sql = ` INSERT INTO workspace_account (
                  workspace_id,
                  account_id,
                  is_admin
                ) 
                VALUES ($1, $2, $3)`;
  await pool.query(sql, [workspaceId, accountId, isAdmin]);
};

const removeAccount = async (workspaceId, accountId) => {
  const sql = ` DELETE FROM 
                  workspace_account
                WHERE
                  workspace_id = $1
                  AND account_id = $2`;
  await pool.query(sql, [workspaceId, accountId]);
};

const create = async (accountId, name, color) => {
  const sql = ` INSERT INTO workspace (
                  name,
                  color
                ) 
                VALUES ($1, $2)
                RETURNING workspace_id`;
  const response = await pool.query(sql, [name, color]);

  await addAccount(response.rows[0].workspace_id, accountId, true);
};

const getAll = async (accountId) => {
  const sql = ` SELECT 
                  w.workspace_id,
                  w.name,
                  w.color,
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

const updateAccountRole = async (workspaceId, accountId, isAdmin) => {
  const sql = ` UPDATE
                  workspace_account 
                SET
                  is_admin = $1
                WHERE
                  workspace_id = $2
                  AND account_id = $3`;
  await pool.query(sql, [isAdmin, workspaceId, accountId]);
};

const update = async (workspaceId, name, color) => {
  const sql = ` UPDATE
                  workspace
                SET
                  name = $1,
                  color = $2
                WHERE
                  workspace_id = $3`;
  await pool.query(sql, [name, color, workspaceId]);
};

module.exports = {
  addAccount,
  removeAccount,
  create,
  getAll,
  getOne,
  isWorkspaceAdmin,
  getAdminCount,
  isInWorkspace,
  updateAccountRole,
  update,
};
