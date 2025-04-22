const pool = require('../config/db');

const create = async (nodeId, locationId, photoDate, endHour, photoPath) => {
  const sql = ` INSERT INTO photo (
                  node_id,
                  location_id, 
                  photo_date, 
                  photo_hour,
                  photo_path
                )
                VALUES ($1, $2, $3, $4, $5)`;

  await pool.query(
    sql,
    [nodeId, locationId, photoDate, endHour, photoPath],
  );
};

const checkForPhoto = async (locationId, photoDate, photoHour) => {
  const sql = ` SELECT EXISTS (
                  SELECT 
                    true
                  FROM
                    photo
                  WHERE 
                    location_id = $1
                    AND photo_date = $2
                    AND photo_hour = $3
                )`;

  const response = await pool.query(sql, [locationId, photoDate, photoHour]);
  return response.rows[0].exists;
};

const checkDateForPhotos = async (nodeId, locationId, date) => {
  const sql = ` SELECT EXISTS (
                  SELECT 1
                  FROM 
                    photo
                  WHERE 
                        node_id = $1
                    AND location_id = $2
                    AND photo_date = $3
                );`;

  const response = await pool.query(sql, [nodeId, locationId, date]);
  return response.rows[0].exists;
};

const getPhotoPath = async (nodeId, locationId, date, hour) => {
  const sql = ` SELECT
                  photo_path
                FROM
                  photo
                WHERE
                      node_id = $1
                  AND location_id = $2
                  AND photo_date = $3
                  AND photo_hour = $4`;

  const response = await pool.query(sql, [nodeId, locationId, date, hour]);
  return response.rows;
};

module.exports = {
  create,
  checkForPhoto,
  checkDateForPhotos,
  getPhotoPath,
};
