const pool = require('./db');

const getVariableId = async (variableName) => {
  const sql = ` SELECT 
                  variable_id 
                FROM 
                  variable
                WHERE variable_name = $1`;

  const response = await pool.query(sql, [variableName]);
  return response.rows[0].variable_id;
};

const insertReading = async (reading) => {
  // console.log(reading);
  // console.log('---');
  const {
    nodeType,
    nodeId,
    readingDate,
    readingTime,
    variableName,
    readingValue,
  } = reading;

  const variableId = getVariableId(variableName).then(async (vId) => {
    const sql = ` INSERT INTO
                  reading (
                    node_type, 
                    node_id, 
                    variable_id,  
                    reading_date, 
                    reading_time, 
                    reading_value
                  )
                  VALUES ($1, $2, $3, $4, $5, $6)
                  RETURNING *`;

    const response = await pool.query(
      sql,
      [nodeType, nodeId, vId, readingDate, readingTime, readingValue],
    );
  });
};

const calculateAverageReadings = async (date) => {
  const fullDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const endTime = date.getHours();
  const startTime = (endTime === 0) ? 23 : endTime - 1;

  const sql = ` SELECT 
                  node_type AS nodeType, 
                  node_id AS nodeId, 
                  variable_id AS variableId,                   
                  AVG(reading_value) AS averageValue
                FROM 
                  reading
                WHERE 
                  reading_date      = $1
                  AND reading_time >= $2 
                  AND reading_time <= $3
                GROUP BY 
                  node_type,
                  node_id,
                  variable_id`;

  const response = await pool.query(sql, [fullDate, `${startTime}:00:00`, `${startTime}:59:59`]);

  // response.rows.forEach((averageReading) => {
  //   console.log(insertAverageReading(averageReading, fullDate, `${endTime}:00:00`))
  // })
};

const insertAverageReading = async (averageReading, fullDate, endHour) => {
  const {
    nodeType,
    nodeId,
    variableId,
    averageValue,
  } = averageReading;
  const sql = ` INSERT INTO average_reading 
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`;

  const response = await pool.query(
    sql,
    [nodeType, nodeId, variableId, fullDate, endHour, averageValue],
  );
  return response.rows;
};

module.exports = {
  calculateAverageReadings,
  insertReading,
};
