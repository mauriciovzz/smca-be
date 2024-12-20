const pool = require('../config/db');

const create = async (nodeId, locationId, variableId, readingDate, readingTime, readingValue) => {
  const sql = ` INSERT INTO reading (
                  node_id,
                  location_id,
                  variable_id,
                  reading_date,
                  reading_time,
                  reading_value
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)`;

  await pool.query(
    sql,
    [nodeId, locationId, variableId, readingDate, readingTime, readingValue],
  );
};

const calculatePastHourAverages = async (date, pastHour) => {
  const sql = ` SELECT 
                  node_id AS nodeId,
                  location_id AS locationId,
                  variable_id AS variableId,             
                  ROUND(AVG(reading_value)::numeric,2) AS averageValue
                FROM 
                  reading
                WHERE 
                  reading_date      = $1
                  AND reading_time >= $2 
                  AND reading_time <= $3
                GROUP BY 
                  node_id,
                  variable_id,
                  location_id`;

  const response = await pool.query(sql, [date, `${pastHour}:00:00`, `${pastHour}:59:59`]);
  return response.rows;
};

const createAverage = async (average, date, currenHour) => {
  const { nodeid, locationid, variableId, averageValue } = average;

  const sql = ` INSERT INTO readings_average (
                  node_id,
                  location_id,
                  variable_id,
                  average_date,
                  avergae_time,
                  average_value
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)`;

  await pool.query(
    sql,
    [nodeid, locationid, variableId, date, currenHour, Math.round(averageValue)],
  );
};

const deletePastHourReadings = async (date, pastHour) => {
  const sql = ` DELETE FROM 
                  reading
                WHERE 
                  reading_date      = $1
                  AND reading_time >= $2 
                  AND reading_time <= $3`;

  await pool.query(sql, [date, `${pastHour}:00:00`, `${pastHour}:59:59`]);
};

const getDateVariables = async (nodeId, locationId, date) => {
  const sql = ` SELECT
                  ra.variable_id,
                  va.variable_type,
                  va.name,
                  va.unit,
                  va.color
                FROM
                  readings_average ra,
                  variable va
                WHERE
                  ra.node_id = $1
                  AND ra.location_id = $2
                  AND ra.average_date = $3
                  AND va.variable_id = ra.variable_id
                GROUP BY ra.variable_id, va.variable_type, va.name, va.unit, va.color
                ORDER BY ra.variable_id`;

  const response = await pool.query(sql, [nodeId, locationId, date]);
  return response.rows;
};

const getDateReadings = async (nodeId, locationId, variableId, date) => {
  const sql = ` SELECT 
                  average_hour,
                  average_value
                FROM 
                  readings_average
                WHERE
                  node_id = $1
                  AND location_id = $2
                  AND variable_id = $3
                  AND average_date = $4`;

  const response = await pool.query(sql, [nodeId, locationId, variableId, date]);
  return response.rows;
};

const getDateRange = async (nodeId, locationId, variableId, date) => {
  const sql = ` SELECT        
                  MIN(average_value) as min,                     
                  MAX(average_value) as max
                FROM 
                  readings_average
                WHERE
                  node_id = $1
                  AND location_id = $2
                  AND variable_id = $3
                  AND average_date = $4`;

  const response = await pool.query(sql, [nodeId, locationId, variableId, date]);
  return response.rows[0];
};

module.exports = {
  create,
  calculatePastHourAverages,
  createAverage,
  deletePastHourReadings,
  getDateVariables,
  getDateReadings,
  getDateRange,
};
