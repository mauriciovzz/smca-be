const pool = require('../config/db');

const isNameTaken = async (spaceId, variableId, name) => {
  const sql = ` SELECT EXISTS (
                  SELECT 
                    true
                  FROM
                    variable
                  WHERE 
                    space_id = $1
                    AND name = $2
                )`;

  const sqlWithVar = ` SELECT EXISTS (
                        SELECT 
                          true
                        FROM
                          variable
                        WHERE 
                          space_id = $1
                          AND variable_id != $2 
                          AND name = $3
                      )`;

  const response = await pool.query(
    (variableId) ? sqlWithVar : sql,
    (variableId) ? [spaceId, variableId, name] : [spaceId, name],
  );

  return response.rows[0].exists;
};

const create = async (spaceId, variableType, valueType, name, unit, color) => {
  const sql = ` INSERT INTO variable (
                  space_id,
                  variable_type,
                  value_type,
                  name,
                  unit,
                  color
                )
                VALUES ($1, $2, $3, $4, $5, $6)`;

  await pool.query(sql, [spaceId, variableType, valueType, name, unit, color]);
};

const getAll = async (spaceId) => {
  const sql = ` SELECT 
                  variable_id, variable_type, value_type, name, unit, color
                FROM
                  variable
                WHERE
                  space_id = $1
                  AND name != 'lluvia'
                ORDER BY variable_type, value_type, name`;

  const response = await pool.query(sql, [spaceId]);
  return response.rows;
};

const find = async (variableId, spaceId) => {
  const sql = ` SELECT 
                 variable_id, space_id, value_type
                FROM
                  variable
                WHERE
                  variable_id = $1
                  AND space_id = $2 `;

  const response = await pool.query(sql, [variableId, spaceId]);
  return response.rows[0];
};

const update = async (variableId, name, unit, color) => {
  const sql = ` UPDATE 
                  variable
                SET 
                  name = $2,
                  unit = $3,
                  color = $4
                WHERE
                  variable_id = $1`;

  await pool.query(sql, [variableId, name, unit, color]);
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

  const response = await pool.query(sql, [variableId]);
  return response.rows[0].exists;
};

const remove = async (variableId) => {
  const sql = ` DELETE FROM 
                  variable                
                WHERE 
                  variable_id = $1`;

  await pool.query(sql, [variableId]);
};

const getRainVariable = async (spaceId) => {
  const sql = ` SELECT 
                  variable_id, variable_type, value_type, name, unit, color
                FROM
                  variable
                WHERE
                  space_id = $1
                  AND name = 'lluvia'`;

  const response = await pool.query(sql, [spaceId]);
  return response.rows;
};

module.exports = {
  isNameTaken,
  create,
  getAll,
  find,
  update,
  isBeingUsed,
  remove,
  getRainVariable,
};
