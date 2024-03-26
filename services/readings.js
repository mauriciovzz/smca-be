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

const getDayReadings = async (nodeId, componentId, variableId, date) => {
  const sql = ` SELECT 
                  end_hour,
                  average
                FROM 
                  readings_average
                WHERE
                  node_id = $1
                  AND component_id = $2
                  AND variable_id = $3
                  AND average_date = $4`;

  const response = await pool.query(sql, [nodeId, componentId, variableId, date]);
  return response.rows;
};

const getDayRanges = async (nodeId, componentId, variableId, date) => {
  const sql = ` SELECT        
                  MIN(average) as min,                     
                  MAX(average) as max
                FROM 
                  readings_average
                WHERE
                  node_id = $1
                  AND component_id = $2
                  AND variable_id  = $3
                  AND average_date = $4`;

  const response = await pool.query(sql, [nodeId, componentId, variableId, date]);
  return response.rows[0];
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

const canAccountAccessReadings = async (accountId, nodeId) => {
  const sql = ` SELECT EXISTS (
                  SELECT
                    account_id
                  FROM
                    workspace_account ws,
                    node no
                  WHERE
                    ws.account_id = $1
                    AND ws.workspace_id = no.workspace_id
                    AND no.node_id = $2
                )`;

  const response = await pool.query(sql, [accountId, nodeId]);
  return response.rows[0].exists;
};

module.exports = {
  create,
  getDayReadings,
  getDayRanges,
  getPastHourAverages,
  createReadingsAverage,
  canAccountAccessReadings,
};
