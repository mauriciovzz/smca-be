const pool = require('../config/db');

const isNameTaken = async (spaceId, componentId, name) => {
  const sql = ` SELECT EXISTS (
                  SELECT 
                    true
                  FROM
                    component
                  WHERE 
                    space_id = $1
                    AND name = $2
                )`;

  const sqlWithVar = ` SELECT EXISTS (
                        SELECT 
                          true
                        FROM
                          component
                        WHERE 
                          space_id = $1
                          AND component_id != $2 
                          AND name = $3
                      )`;

  const response = await pool.query(
    (componentId) ? sqlWithVar : sql,
    (componentId) ? [spaceId, componentId, name] : [spaceId, name],
  );

  return response.rows[0].exists;
};

const create = async (spaceId, type, name, datasheetLink) => {
  const sql = ` INSERT INTO component (
                  space_id,
                  type,
                  name,
                  datasheet_link
                )
                VALUES ($1, $2, $3, $4)
                RETURNING *`;

  const response = await pool.query(sql, [spaceId, type, name, datasheetLink]);
  return response.rows[0];
};

const getAll = async (spaceId) => {
  const sql = ` SELECT 
                  component_id,
                  type,
                  name,
                  datasheet_link
                FROM
                  component
                WHERE
                  space_id = $1
                ORDER BY type ASC, name ASC`;

  const response = await pool.query(sql, [spaceId]);
  return response.rows;
};

const find = async (componentId, spaceId) => {
  const sql = ` SELECT 
                  component_id, space_id, type
                FROM
                  component
                WHERE 
                  component_id = $1
                  AND space_id = $2`;

  const response = await pool.query(sql, [componentId, spaceId]);
  return response.rows[0];
};

const getVariables = async (componentId) => {
  const sql = ` SELECT 
                  v.variable_id,
                  v.variable_type,
                  v.value_type,
                  v.name,
                  v.unit,
                  v.color
                FROM 
                  variable v,
                  component_variable cv 
                WHERE
                  v.variable_id = cv.variable_id
                  AND cv.component_id = $1
                ORDER BY v.variable_type ASC, v.value_type ASC, v.name ASC`;

  const response = await pool.query(sql, [componentId]);
  return response.rows;
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

const update = async (componentId, name, datasheetLink) => {
  const sql = ` UPDATE 
                  component
                SET 
                  name = $2,
                  datasheet_link = $3
                WHERE
                  component_id = $1`;

  await pool.query(sql, [componentId, name, datasheetLink]);
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

const remove = async (componentId) => {
  const sql = ` DELETE FROM 
                  component                
                WHERE 
                  component_id = $1`;

  await pool.query(sql, [componentId]);
};

module.exports = {
  isNameTaken,
  create,
  getAll,
  find,
  getVariables,
  addVariable,
  removeVariable,
  isComponentVariableBeingUsed,
  update,
  isBeingUsed,
  remove,
};
