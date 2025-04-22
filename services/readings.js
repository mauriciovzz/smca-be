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
                VALUES ($1, $2, $3, $4, $5, $6)`;

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
                  ROUND(AVG(reading_value)::numeric,3) AS averageValue
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
  const { nodeid, locationid, variableid, averagevalue } = average;

  const sql = ` INSERT INTO readings_average (
                  node_id,
                  location_id,
                  variable_id,
                  average_date,
                  average_hour,
                  average_value
                )
                VALUES ($1, $2, $3, $4, $5, $6)`;

  await pool.query(
    sql,
    [nodeid, locationid, variableid, date, currenHour, averagevalue],
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

const calculateAverageForAQI = async (locationId, variableId, start, end) => {
  const sql = ` SELECT 
                  COUNT(*) AS rows_count, 
                  AVG(average_value) AS average
                FROM 
                  readings_average
                WHERE 
                      (average_date > $1 OR (average_date = $1 AND average_hour >= $2))
                  AND (average_date < $3 OR (average_date = $3 AND average_hour <= $4))
                  AND location_id = $5
                  AND variable_id = $6`;

  const response = await pool.query(
    sql,
    [start.date, start.hour, end.date, end.hour, locationId, variableId],
  );
  return response.rows[0];
};

const createAqiValue = async (nodeid, locationid, variableid, date, hour, aqi) => {
  const sql = ` INSERT INTO aqi (
                  node_id,
                  location_id,
                  variable_id,
                  aqi_date,
                  aqi_hour,
                  aqi_value
                )
                VALUES ($1, $2, $3, $4, $5, $6)`;

  await pool.query(
    sql,
    [nodeid, locationid, variableid, date, hour, aqi],
  );
};

const getVariableCurrentValue = async (date, pastHour, nodeId, variableId) => {
  const sql = ` SELECT 
                  average_value 
                FROM 
                  readings_average
                WHERE
                  average_date = $1
                  AND average_hour= $2
                  AND node_id = $3
                  AND variable_id = $4`;

  const response = await pool.query(sql, [date, pastHour, nodeId, variableId]);
  return response.rows[0]?.average_value;
};

const getVariableCurrentAQI = async (date, pastHour, nodeId, variableId) => {
  const sql = ` SELECT 
                  aqi_value
                FROM 
                  aqi
                WHERE
                  aqi_date = $1
                  AND aqi_hour= $2
                  AND node_id = $3
                  AND variable_id = $4`;

  const response = await pool.query(sql, [date, pastHour, nodeId, variableId]);
  return response.rows[0]?.aqi_value;
};

const getDateVariables = async (nodeId, locationId, date) => {
  const sql = ` SELECT
                  ra.variable_id,
                  va.variable_type,
                  va.value_type,
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
                GROUP BY ra.variable_id, va.variable_type, va.value_type, va.name, va.unit, va.color
                ORDER BY ra.variable_id`;

  const response = await pool.query(sql, [nodeId, locationId, date]);
  return response.rows;
};

const getDateReadings = async (nodeId, locationId, variableId, date) => {
  const sql = ` SELECT 
                  average_hour AS hour,
                  average_value AS value
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

const getDateReadingsRange = async (nodeId, locationId, variableId, date) => {
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

const getDateAQIs = async (nodeId, locationId, variableId, date) => {
  const sql = ` SELECT 
                  aqi_hour AS hour,
                  aqi_value AS value
                FROM 
                  aqi
                WHERE
                  node_id = $1
                  AND location_id = $2
                  AND variable_id = $3
                  AND aqi_date = $4`;

  const response = await pool.query(sql, [nodeId, locationId, variableId, date]);
  return response.rows;
};

const getDateAqisRange = async (nodeId, locationId, variableId, date) => {
  const sql = ` SELECT        
                  MIN(aqi_value) as min,                     
                  MAX(aqi_value) as max
                FROM 
                  aqi
                WHERE
                  node_id = $1
                  AND location_id = $2
                  AND variable_id = $3
                  AND aqi_date = $4`;

  const response = await pool.query(sql, [nodeId, locationId, variableId, date]);
  return response.rows[0];
};

module.exports = {
  create,
  calculatePastHourAverages,
  createAverage,
  deletePastHourReadings,
  calculateAverageForAQI,
  createAqiValue,
  getVariableCurrentValue,
  getVariableCurrentAQI,
  getDateVariables,
  getDateReadings,
  getDateReadingsRange,
  getDateAQIs,
  getDateAqisRange,
};
