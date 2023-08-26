const pool = require('./db');

const insertReading = async (reading) => {
  try {
    const {
      nodeType,
      nodeId,
      readingDate,
      readingTime,
      variableId,
      readingValue,
    } = reading;

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

    await pool.query(
      sql,
      [nodeType, nodeId, variableId, readingDate, readingTime, readingValue],
    )
      .then((response) => {
        console.log(response.rows);
      });
  } catch (error) {
    console.error(error);
  }
};

const insertAverageReading = async (averageReading, fullDate, endHour) => {
  const {
    nodetype,
    nodeid,
    variableid,
    averagevalue,
  } = averageReading;

  const sql = ` INSERT INTO average_reading
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`;

  await pool.query(
    sql,
    [nodetype, nodeid, variableid, fullDate, `${endHour}:00:00`, averagevalue],
  )
    .then((response) => {
      console.log(response.rows);
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
                  ROUND(AVG(reading.reading_value)::numeric,2) AS averageValue
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

  await pool.query(sql, [fullDate, `${startTime}:00:00`, `${startTime}:59:59`])
    .then((response) => {
      response.rows.forEach((row) => insertAverageReading(row, fullDate, endTime));
    });
};

module.exports = {
  calculateAverageReadings,
  insertReading,
};
