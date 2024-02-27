const pool = require('../utils/databaseHelper');

const getTypes = async () => {
  const sql = ` SELECT 
                 *
                FROM
                  variable_type`;
  const response = await pool.query(sql);
  return response.rows;
};

const getAll = async (workspaceId) => {
  const sql = ` SELECT 
                  v.variable_id,
                  v.workspace_id,
                  v.name,
                  v.unit,
                  vt.type
                FROM
                  variable v,
                  variable_type vt
                WHERE
                  workspace_id = $1
                  AND v.variable_type_id = vt.variable_type_id
                ORDER BY v.name ASC `;

  const response = await pool.query(sql, [workspaceId]);
  return response.rows;
};

const getOne = async (workspaceId, varibleId) => {
  const sql = ` SELECT 
                 *
                FROM
                  variable
                WHERE
                  workspace_id = $1
                  AND variable_id = $2`;
  const response = await pool.query(sql, [workspaceId, varibleId]);
  return response.rows[0];
};

const checkName = async (workspaceId, name) => {
  const sql = ` SELECT 
                 *
                FROM
                  variable
                WHERE
                  workspace_id = $1
                  AND name = $2`;
  const response = await pool.query(sql, [workspaceId, name]);
  return response.rows[0];
};

const create = async (workspaceId, name, unit, variableType) => {
  const sql = ` INSERT INTO variable (
                  workspace_id,
                  name,
                  unit,
                  variable_type_id
                )
                VALUES ($1, $2, $3, $4)`;
  await pool.query(sql, [workspaceId, name, unit, variableType]);
};

const update = async (workspaceId, variableId, name, unit) => {
  const sql = ` UPDATE 
                  variable
                SET 
                  name = $1,
                  unit = $2
                WHERE
                  workspace_id = $3
                  AND variable_id = $4`;
  await pool.query(sql, [name, unit, workspaceId, variableId]);
};

const isBeingUsed = async (variableId) => {
  const sql = ` SELECT EXISTS (
                  SELECT
                    *
                  FROM 
                    component_variable 
                  WHERE 
                    variable_id = $1
                ) AS "exists"`;
  const variableFound = await pool.query(sql, [variableId]);
  return variableFound.rows[0].exists;
};

const remove = async (workspaceId, variableId) => {
  const sql = ` DELETE FROM 
                  variable                
                WHERE 
                  workspace_id = $1
                  AND variable_id = $2`;

  await pool.query(sql, [workspaceId, variableId]);
};

module.exports = {
  getTypes,
  getAll,
  getOne,
  checkName,
  create,
  update,
  isBeingUsed,
  remove,
};
