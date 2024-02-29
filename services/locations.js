const pool = require('../utils/databaseHelper');

const getAll = async (workspaceId) => {
  const sql = ` SELECT 
                  *
                FROM
                  location
                WHERE
                  workspace_id = $1
                ORDER BY name ASC `;

  const response = await pool.query(sql, [workspaceId]);
  return response.rows;
};

const getOne = async (workspaceId, locationId) => {
  const sql = ` SELECT 
                  *
                FROM
                  location
                WHERE 
                  workspace_id = $1
                  AND location_id = $2`;
  const response = await pool.query(sql, [workspaceId, locationId]);
  return response.rows[0];
};

const checkCoordinates = async (workspaceId, lat, long) => {
  const sql = ` SELECT 
                 *
                FROM
                  location
                WHERE
                  workspace_id = $1
                  AND lat = $2
                  AND long = $3`;
  const response = await pool.query(sql, [workspaceId, lat, long]);
  return response.rows[0];
};

const checkColumn = async (workspaceId, column, value) => {
  const sql = ` SELECT 
                 *
                FROM
                  location
                WHERE
                  workspace_id = $1
                  AND ${column} = $2`;
  const response = await pool.query(sql, [workspaceId, value]);
  return response.rows[0];
};

const create = async (workspaceId, name, location, lat, long) => {
  const sql = ` INSERT INTO location (
                  workspace_id,
                  name,
                  location,
                  lat,
                  long
                )
                VALUES ($1, $2, $3, $4, $5)`;
  await pool.query(sql, [workspaceId, name, location, lat, long]);
};

const update = async (workspaceId, componentId, name, location) => {
  const sql = ` UPDATE 
                  location
                SET 
                  name = $1,
                  location = $2
                WHERE
                  workspace_id = $3
                  AND location_id = $4`;
  await pool.query(sql, [name, location, workspaceId, componentId]);
};

const remove = async (workspaceId, locationId) => {
  const sql = ` DELETE FROM 
                  location                
                WHERE 
                  workspace_id = $1
                  AND location_id = $2`;
  await pool.query(sql, [workspaceId, locationId]);
};

module.exports = {
  getAll,
  getOne,
  checkCoordinates,
  checkColumn,
  create,
  update,
  remove,
};
