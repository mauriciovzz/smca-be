const pool = require('../utils/databaseHelper');

const getTypes = async () => {
  const sql = ` SELECT 
                 *
                FROM
                  component_type`;
  const response = await pool.query(sql);
  return response.rows;
};

const getAll = async (workspaceId) => {
  const sql = ` SELECT 
                  co.component_id,
                  co.workspace_id,
                  co.name,
                  co.datasheet_link,
                  ct.type
                FROM
                  component co,
                  component_type ct
                WHERE
                  ct.component_type_id = co.component_type_id
                  AND co.workspace_id = $1
                ORDER BY name ASC `;

  const response = await pool.query(sql, [workspaceId]);
  return response.rows;
};

const getOne = async (workspaceId, componentId) => {
  const sql = ` SELECT 
                  co.component_id,
                  co.workspace_id,
                  ct.type,
                  co.name,
                  co.datasheet_link
                FROM
                  component co,
                  component_type ct
                WHERE 
                  ct.component_type_id = co.component_type_id
                  AND co.workspace_id = $1
                  AND co.component_id = $2`;
  const response = await pool.query(sql, [workspaceId, componentId]);
  return response.rows[0];
};

const getVariables = async (componentId) => {
  const sql = ` SELECT 
                  v.workspace_id,
                  v.variable_id,
                  v.name,
                  v.unit,
                  vt.type
                FROM 
                  variable_type vt,
                  variable v,
                  component_variable cv 
                WHERE
                  v.variable_type_id = vt.variable_type_id
                  AND v.variable_id = cv.variable_id
                  AND cv.component_id = $1
                ORDER BY vt.type ASC, v.name ASC`;

  const response = await pool.query(sql, [componentId]);
  return response.rows;
};

const checkColumn = async (workspaceId, column, value) => {
  const sql = ` SELECT 
                 *
                FROM
                  component
                WHERE
                  workspace_id = $1
                  AND ${column} = $2`;
  const response = await pool.query(sql, [workspaceId, value]);
  return response.rows[0];
};

const create = async (workspaceId, name, datasheetLink, componentType) => {
  const sql = ` INSERT INTO component (
                  workspace_id,
                  name,
                  datasheet_link,
                  component_type_id
                )
                VALUES ($1, $2, $3, $4)
                RETURNING *`;
  const response = await pool.query(sql, [workspaceId, name, datasheetLink, componentType]);
  return response.rows[0];
};

const addVariable = async (componentId, variableId) => {
  const sql = ` INSERT INTO component_variable (
                  component_id,
                  variable_id
                )
                VALUES ($1, $2)`;
  await pool.query(sql, [componentId, variableId]);
};

const removeVariable = async (componentId, variableId) => {
  const sql = ` DELETE FROM 
                  component_variable
                WHERE
                  component_id = $1
                  AND variable_id = $2`;
  await pool.query(sql, [componentId, variableId]);
};

const isComponentVariableBeingUsed = async (componentId, variableId) => {
  const sql = ` SELECT EXISTS (
                  SELECT
                    *
                  FROM 
                    node_variable 
                  WHERE 
                    component_id = $1
                    AND variable_id = $2
                ) AS "exists"`;
  const variableFound = await pool.query(sql, [componentId, variableId]);
  return variableFound.rows[0].exists;
};

const update = async (workspaceId, componentId, name, datasheetLink) => {
  const sql = ` UPDATE 
                  component
                SET 
                  name = $1,
                  datasheet_link = $2
                WHERE
                  workspace_id = $3
                  AND component_id = $4`;
  await pool.query(sql, [name, datasheetLink, workspaceId, componentId]);
};

const isBeingUsed = async (componentId) => {
  const sql = ` SELECT EXISTS (
                  SELECT
                    *
                  FROM 
                    node_component 
                  WHERE 
                    component_id = $1
                ) AS "exists"`;
  const componentFound = await pool.query(sql, [componentId]);
  return componentFound.rows[0].exists;
};

const remove = async (workspaceId, componentId) => {
  const sql = ` DELETE FROM 
                  component                
                WHERE 
                  workspace_id = $1
                  AND component_id = $2`;
  await pool.query(sql, [workspaceId, componentId]);
};

module.exports = {
  getTypes,
  getAll,
  getOne,
  getVariables,
  checkColumn,
  create,
  addVariable,
  removeVariable,
  isComponentVariableBeingUsed,
  update,
  isBeingUsed,
  remove,
};
