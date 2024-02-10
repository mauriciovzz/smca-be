const pool = require('../../utils/databaseHelper');

/* Get all active nodes */
const getActiveNodes = async (req, res) => {
  const sql = ` SELECT 
                  n.node_type, 
                  n.node_id, 
                  n.lat , 
                  n.long, 
                  n.start_date, 
                  l.location_name,
                  ( select exists (
                    select *
                    from node_component nc, component com
                    where nc.node_type=n.node_type
                        AND nc.node_id=n.node_id
                        AND nc.component_id=com.component_id
                        AND com.component_type='CAMERA'
                    )
                  ) AS camera
                FROM node n, location l
                  where n.node_state = 'ACT'
                  AND n.lat = l.lat
                  AND n.long = l.long`;

  const response = await pool.query(sql);
  res.send(response.rows);
};

/* Get all nodes */
const getAllNodes = async (req, res) => {
  const sql = ` SELECT 
                  n.node_type, 
                  n.node_id, 
                  n.node_state,
                  n.lat , 
                  n.long, 
                  l.location_name,
                  l.address
                FROM node n, location l
                  WHERE n.lat = l.lat
                  AND n.long = l.long`;

  const response = await pool.query(sql);
  res.send(response.rows);
};

/* Get variable list of a node */
const getVariableList = async (nodeType, nodeId, variableType) => {
  const sqlVariables = `  SELECT 
                            v.variable_id,
                            v.variable_name,
                            v.unit
                          FROM
                            node_variable nv
                          INNER JOIN variable v
                            ON nv.variable_id=v.variable_id
                          WHERE nv.node_type    = $1
                            AND nv.node_id      = $2
                            AND v.variable_type = $3`;
  const variableList = await pool.query(sqlVariables, [nodeType, nodeId, variableType]);
  return variableList.rows;
};

/* Get all reading averages of a node */
const getReadingAverages = async (req, res) => {
  const {
    nodeType, nodeId, lat, long, date, variableType,
  } = req.params;

  const variableList = await getVariableList(nodeType, nodeId, variableType);

  const readingData = [];
  for (let i = 0; i < variableList.length; i += 1) {
    const sqlAverages = ` SELECT 
                            end_hour, 
                            average 
                          FROM reading_average
                          WHERE node_type    = $1
                            AND node_id      = $2
                            AND lat          = $3 
                            AND long         = $4
                            AND variable_id  = $5
                            AND average_date = $6`;
    const values = [nodeType, nodeId, lat, long, variableList[i].variable_id, date];
    // eslint-disable-next-line
    const averageList = await pool.query(sqlAverages, values);

    readingData.push({
      name: variableList[i].variable_name,
      unit: variableList[i].unit,
      averages: averageList.rows,
    });
  }

  return res.status(201).send(readingData);
};

/* Get range of reading averages of a node */
const getAveragesRange = async (req, res) => {
  const {
    nodeType, nodeId, lat, long, date, variableType,
  } = req.params;

  // Get the variables of the node
  const variableList = await getVariableList(nodeType, nodeId, variableType);

  // Get the dates of the week
  const currentDate = new Date(date);
  const sundayDate = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
  const weekDates = [new Date(sundayDate)];

  while (sundayDate.setDate(sundayDate.getDate() + 1) && sundayDate.getDay() !== 0) {
    weekDates.push(new Date(sundayDate));
  }

  // Get averages range
  const readingData = [];

  for (let i = 0; i < variableList.length; i += 1) {
    const weekData = [];

    for (let j = 0; j < 7; j += 1) {
      const sqlAverages = ` SELECT        
                              MIN(average) as min,                     
                              MAX(average) as max
                            FROM reading_average
                            WHERE node_type    = $1
                              AND node_id      = $2
                              AND lat          = $3 
                              AND long         = $4
                              AND variable_id  = $5
                              AND average_date = $6`;
      const values = [nodeType, nodeId, lat, long, variableList[i].variable_id, weekDates[j]];
      // eslint-disable-next-line
      const range = await pool.query(sqlAverages, values);

      weekData.push({
        day: weekDates[j].getDay(),
        min: range.rows[0].min,
        max: range.rows[0].max,
      });
    }

    readingData.push({
      name: variableList[i].variable_name,
      unit: variableList[i].unit,
      ranges: weekData,
    });
  }

  return res.status(201).send(readingData);
};

// /* Add a node */
// const create = async (req, res) => {
//   const { nodeType } = req.body;

//   const type = (nodeType === 'OUTDOOR') ? 'outdoor' : 'indoor';
//   const sql = ` INSERT INTO node (
//                   node_type,
//                   node_id
//                 )
//                 VALUES ($1, nextval('${type}_nodes'))
//                 RETURNING *`;

//   const response = await pool.query(sql, [nodeType]);
//   return res.status(201).send(response.rows);
// };

module.exports = {
  getActiveNodes,
  getAllNodes,
  getReadingAverages,
  getAveragesRange,
  // create,
};
