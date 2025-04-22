const pool = require('../config/db');

const isNameTaken = async (spaceId, name) => {
  const sql = ` SELECT EXISTS (
                  SELECT 
                    true
                  FROM
                    node
                  WHERE 
                    space_id = $1
                    AND name = $2
                )`;

  const response = await pool.query(sql, [spaceId, name]);
  return response.rows[0].exists;
};

const isNodeCodeTaken = async (nodeCode) => {
  const sql = ` SELECT EXISTS (
                  SELECT 
                    true
                  FROM
                    node
                  WHERE 
                    node_code = $1
                )`;

  const response = await pool.query(sql, [nodeCode]);
  return response.rows[0].exists;
};

const create = async (code, spaceId, name, readingInterval, isIndoor, locationId, timeStamp) => {
  const sql = ` INSERT INTO node (
                  node_code,
                  space_id,
                  name,
                  reading_interval,
                  is_indoor,
                  location_id,
                  start_time_stamp
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING node_id`;

  const response = await pool.query(
    sql,
    [code, spaceId, name, readingInterval, isIndoor, locationId, timeStamp],
  );

  return response.rows[0];
};

const addComponent = async (nodeId, componentId) => {
  const sql = ` INSERT INTO node_component (
                  node_id,
                  component_id
                )
                VALUES ($1, $2)`;

  await pool.query(sql, [nodeId, componentId]);
};

const addVariable = async (nodeId, componentId, variableId) => {
  const sql = ` INSERT INTO node_variable (
                  node_id,
                  component_id,
                  variable_id
                )
                VALUES ($1, $2, $3)`;

  await pool.query(sql, [nodeId, componentId, variableId]);
};

const getSpaceNodes = async (spaceId) => {
  const sql = ` SELECT
                  no.space_id,
                  no.node_id,
                  no.name AS node_name,
                  no.reading_interval,
                  no.is_indoor,
                  no.is_active,

                  sp.name AS space_name,
                  sp.color,                 

                  no.location_id,

                  lo.location_id,
                  lo.lat,
                  lo.long,
                  lo.name AS location_name,
                  lo.location,
                  lo.is_visible,
                  no.start_time_stamp
                FROM
                  node no,
                  space sp,
                  location lo
                WHERE
                      no.space_id = $1
                  AND no.location_id IS NOT null
                  AND no.space_id = sp.space_id
                  AND no.location_id = lo.location_id
                ORDER BY no.node_id`;

  const response = await pool.query(sql, [spaceId]);
  return response.rows;
};

const getHomePageNodes = async (accountId) => {
  const sql = ` SELECT 
                  no.space_id,
                  no.node_id,
                  no.name AS node_name,
                  no.is_indoor,
                  no.is_active,

                  sp.name AS space_name,
                  sp.color,

                  lo.location_id,
                  lo.lat,
                  lo.long,
                  lo.name AS location_name,
                  lo.location,
                  lo.is_visible,
                  no.start_time_stamp
                FROM 
                  node no, 
                  space sp,
                  location lo
                WHERE
                  no.location_id IS NOT null
                  AND no.space_id = sp.space_id
                  AND no.location_id = lo.location_id
                  AND (lo.is_visible = TRUE OR  EXISTS (
                                                  SELECT 
                                                    true 
                                                  FROM 
                                                    space_member spm 
                                                  WHERE sp.space_id = spm.space_id 
                                                  AND spm.account_id = $1
                                                ))
                ORDER BY no.node_id`;

  const response = await pool.query(sql, [accountId]);
  return response.rows;
};

const getActiveNodes = async () => {
  const sql = ` SELECT 
                  node_id, location_id
                FROM 
                  node
                WHERE
                  is_active = true`;

  const response = await pool.query(sql);
  return response.rows;
};

const find = async (nodeId, spaceId) => {
  if (spaceId) {
    const sql = ` SELECT 
                    no.node_id, no.node_code, no.space_id, no.name, no.location_id,
                    (select lo.is_visible from location lo where lo.location_id = no.location_id) AS is_visible
                  FROM
                    node no
                  WHERE
                    node_id = $1
                    AND space_id = $2`;

    const response = await pool.query(sql, [nodeId, spaceId]);
    return response.rows[0];
  }

  const sql = ` SELECT 
                  node_id, location_id, space_id
                FROM
                  node
                WHERE
                  node_id = $1`;

  const response = await pool.query(sql, [nodeId]);
  return response.rows[0];
};

const getComponents = async (nodeId) => {
  const sql = ` SELECT
                  co.component_id,
                  co.type,
                  co.name,
                  co.datasheet_link
                FROM
                  component co,
                  node_component nc
                WHERE
                  co.component_id = nc.component_id
                  AND nc.node_id = $1
                ORDER BY co.type ASC, co.name ASC`;

  const response = await pool.query(sql, [nodeId]);
  return response.rows;
};

const getNodeComponentVariables = async (nodeId, componentId) => {
  const sql = ` SELECT
                  va.variable_id,
                  va.variable_type,
                  va.value_type,
                  va.name,
                  va.unit,
                  va.color
                FROM
                  variable va,
                  node_variable nv
                WHERE
                  va.variable_id = nv.variable_id
                  AND nv.node_id = $1
                  AND nv.component_id = $2`;

  const response = await pool.query(sql, [nodeId, componentId]);
  return response.rows;
};

const getVariables = async (nodeId) => {
  const sql = ` SELECT
                  va.variable_id,
                  va.variable_type,
                  va.value_type,
                  va.name,
                  va.unit,
                  va.color
                FROM
                  variable va,
                  node_variable nv
                WHERE
                  va.variable_id = nv.variable_id
                  AND nv.node_id = $1`;

  const response = await pool.query(sql, [nodeId]);
  return response.rows;
};

const updateInfo = async (nodeId, name, isIndoor, readingInterval, isActive) => {
  const sql = ` UPDATE 
                  node
                SET 
                  name = $2,
                  is_indoor = $3,
                  reading_interval = $4,
                  is_active = $5
                WHERE
                  node_id = $1`;

  await pool.query(sql, [nodeId, name, isIndoor, readingInterval, isActive]);
};

const updateLocation = async (nodeId, locationId, timeStamp) => {
  const sql = ` UPDATE 
                  node
                SET 
                  location_id = $2,
                  start_time_stamp = $3
                WHERE
                  node_id = $1`;

  await pool.query(sql, [nodeId, locationId, timeStamp]);
};

const inactivate = async (nodeId) => {
  const sql = ` UPDATE 
                  node
                SET 
                  is_active = false
                WHERE
                  node_id = $1`;

  await pool.query(sql, [nodeId]);
};

const removeComponents = async (nodeId) => {
  const sql = ` DELETE FROM 
                    node_component                
                  WHERE 
                    node_id = $1`;

  await pool.query(sql, [nodeId]);
};

const remove = async (nodeId) => {
  const sql = ` DELETE FROM
                  node
                WHERE
                  node_id = $1`;

  await pool.query(sql, [nodeId]);
};

const checkNodeAndVariable = async (nodeCode, variableId) => {
  const sql = ` SELECT 
                  no.node_id,
                  no.location_id
                FROM 
                  node no,
                  node_variable nv
                WHERE
                  no.node_code = $1
                  AND no.is_active = true
                  AND no.node_id = nv.node_id
                  AND nv.variable_id = $2`;

  const response = await pool.query(sql, [nodeCode, variableId]);
  return response.rows[0];
};

const checkNodeAndCamera = async (nodeCode, componentId) => {
  const sql = ` SELECT 
                  no.node_id,
                  no.location_id
                FROM 
                  node no,
                  node_component nc,
                  component co
                WHERE
                  no.node_code = $1
                  AND no.is_active = true
                  AND no.node_id = nc.node_id
                  AND nc.component_id = co.component_id
                  AND co.type = 'camera'
                  AND co.component_id = $2`;

  const response = await pool.query(sql, [nodeCode, componentId]);
  return response.rows[0];
};

module.exports = {
  isNameTaken,
  isNodeCodeTaken,
  create,
  addComponent,
  addVariable,
  getSpaceNodes,
  getHomePageNodes,
  getActiveNodes,
  find,
  getComponents,
  getNodeComponentVariables,
  getVariables,
  updateInfo,
  updateLocation,
  inactivate,
  removeComponents,
  remove,
  checkNodeAndVariable,
  checkNodeAndCamera,
};
