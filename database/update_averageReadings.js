/* Create all average readings of a hour */
const updateAverageReadings = async (date) => {
  
    const fullDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();  
    const end_time = date.getHours();
    const start_time = (end_time === 0) ? 23 : end_time - 1;
  
    console.log(fullDate + " " + start_time + " " + end_time)
  
    // const response = await pool.query(` SELECT node_type, node_id, variable_id, AVG(reading_value) AS average_value
    //                                     FROM reading
    //                                     WHERE reading_date = $1
    //                                       AND reading_time >= '$2' AND reading_time <= '$3'
    //                                       AND date        = $4 `, [date, ]);
  
    //res.send(response.rows);
    //res.json(values)
};
  

module.exports = {
    updateAverageReadings
}
