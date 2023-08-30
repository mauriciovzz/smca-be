const pool = require('../connections/database');

/* Add a reading */
const create = async (reading) => {
  const {
    nodeType,
    nodeId,
    readingDate,
    readingTime,
    variableId,
    readingValue,
  } = reading;

  const sql = ` INSERT INTO reading (
                  node_type, 
                  node_id, 
                  variable_id,  
                  reading_date, 
                  reading_time, 
                  reading_value
                )
                VALUES ($1, $2, $3, $4, $5, $6)`;

  await pool.query(
    sql,
    [nodeType, nodeId, variableId, readingDate, readingTime, readingValue],
  );
};

module.exports = {
  create,
};
