const pool = require('../config/db');

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

const checkCoordinates = async (lat, long) => {
  const sql = ` SELECT 
                  1
                FROM
                  location
                WHERE
                  lat = $1
                  AND long = $2`;
  const response = await pool.query(sql, [lat, long]);
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

const create = async (workspaceId, lat, long, name, location, isVisible) => {
  const sql = ` INSERT INTO location (
                  workspace_id,
                  lat,
                  long,
                  name,
                  location,
                  is_visible
                )
                VALUES ($1, $2, $3, $4, $5, $6)`;
  await pool.query(sql, [workspaceId, lat, long, name, location, isVisible]);
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

const updateTakenField = async (worskapceId, locationId, isTaken) => {
  const sql = ` UPDATE
                  location
                SET
                  is_taken = $1
                WHERE
                  workspace_id = $2
                  AND location_id = $3`;
  await pool.query(sql, [isTaken, worskapceId, locationId]);
};

module.exports = {
  getAll,
  getOne,
  checkCoordinates,
  checkColumn,
  create,
  update,
  remove,
  updateTakenField,
};
