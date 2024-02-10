const pool = require('../../utils/databaseHelper');

/* Get all average readings of a node variable on a given day */
const getAll = async (req, res) => {
  const {
    nodeType,
    nodeId,
    variableId,
    date,
  } = req.params;

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
  res.send(response.rows);
};

/* Add an average reading */
const create = async (averageReading, fullDate, endHour) => {
  const {
    nodetype,
    nodeid,
    variableid,
    averagevalue,
  } = averageReading;

  const sql = ` INSERT INTO average_reading
                VALUES ($1, $2, $3, $4, $5, $6)`;

  await pool.query(
    sql,
    [nodetype, nodeid, variableid, fullDate, endHour, averagevalue],
  );
};

const calculateAverageReadings = async (serverDate) => {
  const date = new Date(serverDate.toLocaleString('en-US', { timeZone: 'America/Caracas' }));
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

  const response = await pool.query(sql, [fullDate, `${startTime}:00:00`, `${startTime}:59:59`]);
  response.rows.forEach((row) => create(row, fullDate, endTime));
};

module.exports = {
  getAll,
  calculateAverageReadings,
};
