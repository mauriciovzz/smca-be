const pool = require('../database/db')

/* Create all average readings of an hour */
const createAverageReadings = async (date) => {
  
  const fullDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();  
  const end_time = date.getHours();
  const start_time = (end_time === 0) ? 23 : end_time - 1;

  const sql = ` SELECT 
                  node_type, 
                  node_id, 
                  variable_id,                   
                  AVG(reading_value) AS average_value
                FROM 
                  reading
                WHERE 
                  reading_date      = $1
                  AND reading_time >= $2 AND reading_time < $3
                GROUP BY 
                  node_type,
                  node_id,
                  variable_id`
  
  const response = await pool.query(sql, [fullDate, start_time + ":00:00", start_time + ":59:59" ]);
  
  // response.rows.forEach((row) => {    
  //   console.log(insertAverageReadings(row, fullDate, end_time + ":00"))
  // })
};

/* Create all average readings of an hour */
const insertAverageReadings = async (averageReading, date, end_hour) => {
  const { node_type, node_id, variable_id, average_value } = averageReading;
  const sql = ` INSERT INTO average_reading 
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`
  
  const response = await pool.query(sql, [node_type, node_id, variable_id, date, end_hour, average_value]);
  return response;
};

const insertReading = async (reading) => {
  console.log(reading);
  console.log("---");

  const { node_type, node_id, reading_date, reading_time, variable_name, reading_value } = reading;
  const variable_id =  getVariableId(variable_name).then(async (vari) => {
  
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
                RETURNING *`
  
                console.log(variable_id)
  const response = await pool.query(sql, [node_type, node_id, vari, reading_date, reading_time, reading_value]);
  })
};

const getVariableId = async (variable_name) => {
  const sql = ` SELECT 
                  variable_id 
                FROM 
                  variable
                WHERE variable_name = $1`
  
  const response = await pool.query(sql, [variable_name]);
  return response.rows[0].variable_id;
};

module.exports = {
    createAverageReadings,
    insertReading
}
