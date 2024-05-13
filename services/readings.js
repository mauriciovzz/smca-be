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

const getUiInfo = async (nodeId, locationId, date) => {
  const sql = ` SELECT
                  EXISTS (SELECT
                            *
                          FROM
                            readings_average ra,
                            variable va
                          WHERE
                            no.node_id = ra.node_id
                            AND no.location_id = ra.location_id
                            AND ra.average_date = $3
                            AND ra.variable_id = va.variable_id
                            AND va.name = 'temperatura'
                          ) AS has_temp,
                  EXISTS (SELECT
                            *
                          FROM
                            readings_average ra,
                            variable va
                          WHERE
                            no.node_id = ra.node_id
                            AND no.location_id = ra.location_id
                            AND ra.average_date = $3
                            AND ra.variable_id = va.variable_id
                            AND va.name = 'humedad'
                          ) AS has_hum,
                  EXISTS (SELECT
                            *
                          FROM
                            readings_average ra,
                            variable va
                          WHERE
                            no.node_id = ra.node_id
                            AND no.location_id = ra.location_id
                            AND ra.average_date = $3
                            AND ra.variable_id = va.variable_id
                            AND va.name = 'presión atmosférica'
                          ) AS has_press,
                  EXISTS (SELECT
                            *
                          FROM
                            readings_average ra,
                            variable va
                          WHERE
                            no.node_id = ra.node_id
                            AND no.location_id = ra.location_id
                            AND ra.average_date = $3
                            AND ra.variable_id = va.variable_id
                            AND va.name = 'lluvia'
                          ) AS has_rain,
                  EXISTS (SELECT
                            *
                          FROM
                            photo ph
                          WHERE
                            no.node_id = ph.node_id
                            AND no.location_id = ph.location_id
                            AND ph.photo_date = $3
                          ) AS has_cam
                FROM
                  node no
                WHERE
                  no.node_id = $1
                  AND no.location_id = $2`;

  const response = await pool.query(sql, [nodeId, locationId, date]);
  return response.rows[0];
};

const getDayVariables = async (nodeId, locationId, date) => {
  const sql = ` SELECT
                  vt.type,
                  ra.variable_id,
                  va.name,
                  va.unit
                FROM
                  readings_average ra,
                  variable va,
                  variable_type vt
                WHERE
                  ra.node_id = $1
                  AND ra.location_id = $2
                  AND ra.average_date = $3
                  AND va.variable_id = ra.variable_id
                  AND va.variable_type_id = vt.variable_type_id
                GROUP BY vt.type, ra.variable_id, va.name, va.unit
                ORDER BY ra.variable_id`;

  const response = await pool.query(sql, [nodeId, locationId, date]);
  return response.rows;
};

const getDayReadings = async (nodeId, locationId, variableId, date) => {
  const sql = ` SELECT 
                  end_hour,
                  average
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

const getDayRanges = async (nodeId, locationId, variableId, date) => {
  const sql = ` SELECT        
                  MIN(average) as min,                     
                  MAX(average) as max
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

const deletePastHourReadings = async (fullDate, startTime) => {
  const sql = ` DELETE FROM 
                  reading
                WHERE 
                  reading_date      = $1
                  AND reading_time >= $2 
                  AND reading_time <= $3`;

  await pool.query(sql, [fullDate, `${startTime}:00:00`, `${startTime}:59:59`]);
};

const createReadingsAverage = async (readingAverage, fullDate, endHour) => {
  const {
    nodeid, componentid, variableid, locationid, averagevalue,
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
    [nodeid, componentid, variableid, locationid, fullDate, endHour, averagevalue],
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
  getUiInfo,
  getDayVariables,
  getDayReadings,
  getDayRanges,
  getPastHourAverages,
  deletePastHourReadings,
  createReadingsAverage,
  canAccountAccessReadings,
};
