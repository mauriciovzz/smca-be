const pool = require('../config/db');

const createReference = async (
  nodeId,
  locationId,
  componentId,
  photoDate,
  endHour,
  photoPath,
) => {
  const sql = ` INSERT INTO photo (
                  node_id,
                  location_id, 
                  component_id,
                  photo_date, 
                  end_hour,
                  photo_path
                )
                VALUES ($1, $2, $3, $4, $5, $6)`;

  await pool.query(
    sql,
    [nodeId, locationId, componentId, photoDate, endHour, photoPath],
  );
};

const getDayReferences = async (nodeId, locationId, date) => {
  const sql = ` SELECT 
                  end_hour,
                  photo_path
                FROM 
                  photo
                WHERE
                  node_id = $1
                  AND location_id = $2
                  AND photo_date = $3`;

  const response = await pool.query(sql, [nodeId, locationId, date]);
  return response.rows;
};

module.exports = {
  createReference,
  getDayReferences,
};
