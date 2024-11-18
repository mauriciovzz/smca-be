const pool = require('../config/db');

const areCoordinatesTaken = async (lat, long) => {
  const sql = ` SELECT EXISTS (
    SELECT 
      true
    FROM
      location
    WHERE 
      lat = $1
      AND long = $2
  )`;

  const response = await pool.query(sql, [lat, long]);
  return response.rows[0].exists;
};

const create = async (spaceId, lat, long, name, location) => {
  const sql = ` INSERT INTO location (
                  space_id,
                  lat,
                  long,
                  name,
                  location
                )
                VALUES ($1, $2, $3, $4, $5)`;

  await pool.query(sql, [spaceId, lat, long, name, location]);
};

const getAll = async (spaceId) => {
  const sql = ` SELECT 
                  location_id, lat, long, name, location, is_taken, is_visible
                FROM
                  location
                WHERE
                  space_id = $1
                ORDER BY space_id ASC`;

  const response = await pool.query(sql, [spaceId]);
  return response.rows;
};

const find = async (locationId, spaceId) => {
  const sql = ` SELECT 
                  location_id, space_id, is_taken
                FROM
                  location
                WHERE
                  location_id = $1
                  AND space_id = $2`;

  const response = await pool.query(sql, [locationId, spaceId]);
  return response.rows[0];
};

const update = async (locationId, name, location, isVisible) => {
  const sql = ` UPDATE 
                  location
                SET 
                  name = $2,
                  location = $3,
                  is_visible = $4
                WHERE
                  location_id = $1`;

  await pool.query(sql, [locationId, name, location, isVisible]);
};

const remove = async (locationId) => {
  const sql = ` DELETE FROM 
                  location                
                WHERE 
                  location_id = $1`;

  await pool.query(sql, [locationId]);
};

const updateIsTaken = async (locationId, isTaken) => {
  const sql = ` UPDATE
                  location
                SET
                  is_taken = $2
                WHERE
                  location_id = $1`;

  await pool.query(sql, [locationId, isTaken]);
};

const updateIsVisible = async (locationId) => {
  const sql = ` UPDATE
                  location
                SET
                  is_visible = NOT is_visible
                WHERE
                  location_id = $1`;

  await pool.query(sql, [locationId]);
};

module.exports = {
  areCoordinatesTaken,
  create,
  getAll,
  find,
  update,
  remove,
  updateIsTaken,
  updateIsVisible,
};
