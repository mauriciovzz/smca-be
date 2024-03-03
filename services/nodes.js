const pool = require('../utils/databaseHelper');

const getTypes = async () => {
  const sql = ` SELECT 
                 *
                FROM
                  node_type`;
  const response = await pool.query(sql);
  return response.rows;
};

const getAll = async (workspaceId) => {
  const sql = ` SELECT 
                  no.node_id,
                  no.workspace_id,
                  nt.type,
                  no.is_visible,
                  ns.state,
                  no.reading_interval,
                  lo.location_id,
                  lo.name,
                  lo.location,
                  lo.lat,
                  lo.long,
                  no.start_date  
                FROM
                  node no,
                  node_type nt,
                  node_state ns,
                  location lo
                WHERE
                  no.node_type_id = nt.node_type_id
                  AND no.node_state_id = ns.node_state_id 
                  AND no.location_id = lo.location_id
                  AND no.workspace_id = $1
                ORDER BY no.node_id ASC `;

  const response = await pool.query(sql, [workspaceId]);
  return response.rows;
};

// const getOne = async (workspaceId, locationId) => {
//   const sql = ` SELECT
//                   *
//                 FROM
//                   location
//                 WHERE
//                   workspace_id = $1
//                   AND location_id = $2`;
//   const response = await pool.query(sql, [workspaceId, locationId]);
//   return response.rows[0];
// };

// const checkCoordinates = async (workspaceId, lat, long) => {
//   const sql = ` SELECT
//                  *
//                 FROM
//                   location
//                 WHERE
//                   workspace_id = $1
//                   AND lat = $2
//                   AND long = $3`;
//   const response = await pool.query(sql, [workspaceId, lat, long]);
//   return response.rows[0];
// };

// const checkColumn = async (workspaceId, column, value) => {
//   const sql = ` SELECT
//                  *
//                 FROM
//                   location
//                 WHERE
//                   workspace_id = $1
//                   AND ${column} = $2`;
//   const response = await pool.query(sql, [workspaceId, value]);
//   return response.rows[0];
// };

// const create = async (workspaceId, name, location, lat, long) => {
//   const sql = ` INSERT INTO location (
//                   workspace_id,
//                   name,
//                   location,
//                   lat,
//                   long
//                 )
//                 VALUES ($1, $2, $3, $4, $5)`;
//   await pool.query(sql, [workspaceId, name, location, lat, long]);
// };

// const update = async (workspaceId, componentId, name, location) => {
//   const sql = ` UPDATE
//                   location
//                 SET
//                   name = $1,
//                   location = $2
//                 WHERE
//                   workspace_id = $3
//                   AND location_id = $4`;
//   await pool.query(sql, [name, location, workspaceId, componentId]);
// };

// const remove = async (workspaceId, locationId) => {
//   const sql = ` DELETE FROM
//                   location
//                 WHERE
//                   workspace_id = $1
//                   AND location_id = $2`;
//   await pool.query(sql, [workspaceId, locationId]);
// };

module.exports = {
  getTypes,
  getAll,
  // getOne,
  // checkCoordinates,
  // checkColumn,
  // create,
  // update,
  // remove,
};
