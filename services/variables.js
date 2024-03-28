const pool = require('../utils/databaseHelper');

const getTypes = async () => {
  const sql = ` SELECT 
                 *
                FROM
                  variable_type`;
  const response = await pool.query(sql);
  return response.rows;
};

const getValueTypes = async () => {
  const sql = ` SELECT 
                 *
                FROM
                  variable_value_type`;
  const response = await pool.query(sql);
  return response.rows;
};

const getAll = async (workspaceId) => {
  const sql = ` SELECT 
                  v.variable_id,
                  v.workspace_id,
                  v.name,
                  v.unit,
                  vt.type,
                  vvt.type AS value_type
                FROM
                  variable v,
                  variable_type vt,
                  variable_value_type vvt
                WHERE
                  workspace_id = $1
                  AND v.variable_type_id = vt.variable_type_id
                  AND v.variable_value_type_id = vvt.variable_value_type_id
                ORDER BY vt.type ASC, v.name ASC`;

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

const create = async (workspaceId, variableType, variableValueType, name, unit) => {
  const sql = ` INSERT INTO variable (
                  workspace_id,
                  variable_type_id,
                  variable_value_type_id,
                  name,
                  unit
                )
                VALUES ($1, $2, $3, $4, $5)`;
  await pool.query(sql, [workspaceId, variableType, variableValueType, name, unit]);
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
  getValueTypes,
  getAll,
  getOne,
  checkName,
  create,
  update,
  isBeingUsed,
  remove,
};
