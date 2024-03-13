const pool = require('../utils/databaseHelper');

const create = async (
  nodeId,
  componenId,
  variableId,
  locationId,
  readingDate,
  readingTime,
  readingValue,
) => {
  const sql = ` INSERT INTO reading (
                  node_id,
                  component_id,
                  variable_id,
                  location_id,
                  reading_date,
                  reading_time,
                  reading_value
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)`;

  await pool.query(
    sql,
    [nodeId, componenId, variableId, locationId, readingDate, readingTime, readingValue],
  );
};

const getAll = async (nodeType, nodeId, variableId, date) => {
  const sql = ` SELECT 
                  end_hour, 
                  average_value
                FROM 
                  average_reading
                WHERE 
                  node_type       = $1
                  AND node_id     = $2
                  AND variable_id = $3
                  AND date        = $4 `;

  const response = await pool.query(sql, [nodeType, nodeId, variableId, date]);
  return response.rows;
};

const getPastHourAverages = async (fullDate, startTime) => {
  const sql = ` SELECT 
                  node_id AS nodeId,
                  component_id AS componentId,
                  variable_id AS variableId,             
                  location_id AS locationId,
                  ROUND(AVG(reading_value)::numeric,2) AS averageValue
                FROM 
                  reading
                WHERE 
                  reading_date      = $1
                  AND reading_time >= $2 
                  AND reading_time <= $3
                GROUP BY 
                  node_id,
                  component_id,
                  variable_id,
                  location_id`;

  const response = await pool.query(sql, [fullDate, `${startTime}:00:00`, `${startTime}:59:59`]);
  return response.rows;
};

const createReadingsAverage = async (readingAverage, fullDate, endHour) => {
  const {
    nodeId, componentId, variableid, locationId, averagevalue,
  } = readingAverage;

  const sql = ` INSERT INTO readings_average (
                  node_id,
                  component_id,
                  variable_id,
                  location_id,
                  average_date,
                  end_hour,
                  average
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)`;

  await pool.query(
    sql,
    [nodeId, componentId, variableid, locationId, fullDate, endHour, averagevalue],
  );
};

module.exports = {
  create,
  getAll,
  getPastHourAverages,
  createReadingsAverage,
};
