const pool = require('../connections/database');
const { requestLogger } = require('../utils/middleware');

const create = async (reading) => {
  try {
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
                  VALUES ($1, $2, $3, $4, $5, $6)
                  RETURNING *`;

    const response = await pool.query(
      sql,
      [nodeType, nodeId, variableId, readingDate, readingTime, readingValue],
    );

    return response.rows;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  create,
};
