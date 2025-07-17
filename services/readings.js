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
                  re.node_id AS nodeId,
                  re.location_id AS locationId,
                  re.variable_id AS variableId,
                  va.name AS variableName,
                  va.value_type AS valueType,        
                  ROUND(AVG(re.reading_value)::numeric,3) AS averageValue
                FROM 
                  reading re,
                  variable va
                WHERE
                  va.variable_id = re.variable_id
                  AND re.reading_date  = $1
                  AND re.reading_time >= $2 
                  AND re.reading_time <= $3
                GROUP BY 
                  re.node_id,
                  re.variable_id,
                  va.name,
                  va.value_type,
                  re.location_id`;

  const response = await pool.query(sql, [date, `${pastHour}:00:00`, `${pastHour}:59:59`]);
  return response.rows;
};

const createAverage = async (nodeid, locationid, variableid, averagevalue, date, currenHour) => {
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

const getLocationsWithReadings = async (accountId) => {
  const sql = ` SELECT 
                  sp.space_id,
                  sp.name AS space_name,
                  sp.color,
                  
                  lo.location_id,
                  lo.lat,
                  lo.long,
                  lo.name AS location_name,
                  lo.location,
                  lo.is_taken,
                  lo.is_visible
                FROM
                  space sp,
                  location lo
                WHERE
                        sp.space_id = lo.space_id
                  AND   (lo.is_visible = TRUE OR  EXISTS (
                                                          SELECT 
                                                        true 
                                                          FROM 
                                                        space_member spm 
                                                          WHERE sp.space_id = spm.space_id 
                                                          AND spm.account_id = $1
                                                        ))
                  AND   (EXISTS (
                            SELECT 
                          true 
                            FROM 
                          readings_average ra 
                            WHERE lo.location_id = ra.location_id
                          ))
                ORDER BY space_name, location_name`;

  const response = await pool.query(sql, [accountId]);
  return response.rows;
};

const getSpaceLocationsWithReadings = async (spaceId) => {
  const sql = ` SELECT 
                  sp.space_id,
                  sp.name AS space_name,
                  sp.color,
                  
                  lo.location_id,
                  lo.lat,
                  lo.long,
                  lo.name AS location_name,
                  lo.location,
                  lo.is_taken,
                  lo.is_visible
                FROM
                  space sp,
                  location lo
                WHERE
                        sp.space_id = lo.space_id
                  AND   sp.space_id = $1
                  AND   (EXISTS (
                            SELECT 
                          true 
                            FROM 
                          readings_average ra 
                            WHERE lo.location_id = ra.location_id
                          ))
                ORDER BY space_name, location_name`;

  const response = await pool.query(sql, [spaceId]);
  return response.rows;
};

const getLocationEarliestReadingDate = async (locationId) => {
  const sql = ` SELECT 
                  MIN(average_date) AS earliest_date
                FROM
                  readings_average
                WHERE
                  location_id = $1
                GROUP BY location_id`;

  const response = await pool.query(sql, [locationId]);
  return response.rows[0].earliest_date;
};

const getLocationReadVariables = async (locationId) => {
  const sql = ` SELECT DISTINCT 
                  ra.variable_id,
                  va.name AS variable_name,
                  va.unit,
                  va.value_type
                FROM 
                  readings_average ra, 
                  variable va
                WHERE 
                  ra.variable_id = va.variable_id
                  and ra.location_id = $1;`;

  const response = await pool.query(sql, [locationId]);
  return response.rows;
};

const getDateReadingsByVariable = async (locationId, variableId, date) => {
  const sql = ` SELECT 
                  average_hour, average_value
                FROM
                  readings_average
                WHERE 
                    location_id = $1
                  AND variable_id= $2
                  AND average_date = $3
                ORDER BY average_hour`;

  const response = await pool.query(sql, [locationId, variableId, date]);
  return response.rows;
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
  getLocationsWithReadings,
  getSpaceLocationsWithReadings,
  getLocationEarliestReadingDate,
  getLocationReadVariables,
  getDateReadingsByVariable,
};
