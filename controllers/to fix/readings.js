const pool = require('../../utils/databaseHelper');
const logger = require('../../utils/logger');

/* Create a reading record */
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
    const values = [nodeType, nodeId, variableId, readingDate, readingTime, readingValue];

    const response = await pool.query(sql, values);
    return response.rows;
  } catch (error) {
    logger.error(`readings: ${error.message}`);
    return null;
  }
};

module.exports = {
  create,
};
