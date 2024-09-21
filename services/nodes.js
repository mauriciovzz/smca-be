const pool = require('../utils/databaseHelper');

const getTypes = async () => {
  const sql = ` SELECT 
                 *
                FROM
                  node_type`;
  const response = await pool.query(sql);
  return response.rows;
};

const getStates = async () => {
  const sql = ` SELECT 
                 *
                FROM
                  node_state`;
  const response = await pool.query(sql);
  return response.rows;
};

const getAll = async (workspaceId) => {
  const sql = ` SELECT 
                  no.node_id,
                  no.workspace_id,
                  no.name AS node_name,
                  nt.type,
                  no.is_visible,
                  ns.state,
                  no.node_code,  
                  ( SELECT lo.name FROM location lo WHERE lo.location_id = no.location_id ) AS location_name,
                  ( SELECT lo.location FROM location lo WHERE lo.location_id = no.location_id ) AS location,
                  ( SELECT lo.lat FROM location lo WHERE lo.location_id = no.location_id ) AS lat,
                  ( SELECT lo.long FROM location lo WHERE lo.location_id = no.location_id ) AS long
                FROM
                  node no,
                  node_type nt,
                  node_state ns
                WHERE
                  no.node_type_id = nt.node_type_id
                  AND no.node_state_id = ns.node_state_id 
                  AND no.workspace_id = $1
                ORDER BY ns.state ASC, no.node_id ASC`;

  const response = await pool.query(sql, [workspaceId]);
  return response.rows;
};

const getPublicNodes = async () => {
  const sql = ` SELECT
                  no.workspace_id,
                  no.node_id,
                  no.name AS node_name,
                  nt.type,
                  ns.state,
                  no.is_visible,
                  no.start_date,
                  lo.location_id,
                  lo.name AS location_name,
                  lo.location,
                  lo.lat,
                  lo.long
                FROM
                  node no,
                  node_type nt,
                  node_state ns,
                  location lo
                WHERE
                  no.node_type_id = nt.node_type_id
                  AND no.node_state_id = ns.node_state_id
                  AND ns.state != 'Terminado'
                  AND no.location_id = lo.location_id
                  AND no.is_visible is true`;

  const response = await pool.query(sql);
  return response.rows;
};

const getAccountNodes = async (accountId) => {
  const sql = ` SELECT
                  no.workspace_id,
                  no.node_id,
                  no.name AS node_name,
                  nt.type,
                  ns.state,
                  no.is_visible,
                  no.start_date,
                  lo.location_id,
                  lo.name AS location_name,
                  lo.location,
                  lo.lat,
                  lo.long
                FROM
                  workspace_account wa,
                  node no,
                  node_type nt,
                  node_state ns,
                  location lo
                WHERE
                  wa.account_id = $1
                  AND wa.workspace_id = no.workspace_id
                  AND no.node_type_id = nt.node_type_id
                  AND no.node_state_id = ns.node_state_id
                  AND ns.state != 'Terminado'
                  AND no.location_id = lo.location_id`;

  const response = await pool.query(sql, [accountId]);
  return response.rows;
};

const getWorkspaceNodes = async (workspaceId) => {
  const sql = ` SELECT
                  no.workspace_id,
                  no.node_id,
                  no.name AS node_name,
                  nt.type,
                  ns.state,
                  no.is_visible,
                  no.start_date,
                  lo.location_id,
                  lo.name AS location_name,
                  lo.location,
                  lo.lat,
                  lo.long
                FROM
                  node no,
                  node_type nt,
                  node_state ns,
                  location lo
                WHERE
                  no.workspace_id = $1
                  AND no.node_type_id = nt.node_type_id
                  AND no.node_state_id = ns.node_state_id
                  AND ns.state != 'Terminado'
                  AND no.location_id = lo.location_id`;

  const response = await pool.query(sql, [workspaceId]);
  return response.rows;
};

const getOne = async (nodeId) => {
  const sql = ` SELECT 
                  *
                FROM 
                  node
                WHERE 
                  node_id = $1`;

  const response = await pool.query(sql, [nodeId]);
  return response.rows[0];
};

const getOneWithNodeCode = async (nodeCode) => {
  const sql = ` SELECT 
                  no.node_id,
                  no.location_id,
                  ns.state 
                FROM 
                  node no,
                  node_state ns
                WHERE 
                  no.node_state_id = ns.node_state_id
                  AND node_code = $1`;

  const response = await pool.query(sql, [nodeCode]);
  return response.rows[0];
};

const checkNodeVariable = async (nodeCode, componentId, variableId) => {
  const sql = ` SELECT 
                  no.node_id,
                  no.location_id
                FROM 
                  node no,
                  node_state ns,
                  node_variable nv
                WHERE
                  no.node_code = $1
                  AND no.node_state_id = ns.node_state_id
                  AND ns.state = 'Activo'
                  AND no.node_id = nv.node_id
                  AND nv.component_id = $2
                  AND nv.variable_id = $3`;

  const response = await pool.query(sql, [nodeCode, componentId, variableId]);
  return response.rows[0];
};

const checkNodeCamera = async (nodeCode, componentId) => {
  const sql = ` SELECT 
                  no.node_id,
                  no.location_id
                FROM 
                  node no,
                  node_state ns,
                  component co,
                  component_type ct,
                  node_component nc
                WHERE
                  no.node_code = $1

                  AND no.node_state_id = ns.node_state_id
                  AND ns.state = 'Activo'

                  AND no.node_id = nc.node_id
                  AND nc.component_id = $2

                  AND co.component_id = $2
                  AND co.component_type_id = ct.component_type_id
                  AND ct.type = 'Camara'`;

  const response = await pool.query(sql, [nodeCode, componentId]);
  return response.rows[0];
};

const getComponents = async (nodeId) => {
  const sql = ` SELECT
                  co.component_id,
                  co.name,
                  co.datasheet_link,
                  ct.component_type_id ,
                  ct.type
                FROM 
                  component_type ct,
                  component co,
                  node_component nc
                WHERE 
                  ct.component_type_id = co.component_type_id
                  AND co.component_id = nc.component_id
                  AND nc.node_id = $1
                ORDER BY ct.component_type_id ASC, co.name ASC`;

  const response = await pool.query(sql, [nodeId]);
  return response.rows;
};

const getVariables = async (nodeId, componentId) => {
  const sql = ` SELECT
                  nv.component_id, 
                  nv.variable_id,
                  va.name,
                  va.unit,
                  vt.type,
                  va.color
                FROM
                  node_variable nv,
                  variable va,
                  variable_type vt
                WHERE
                  va.variable_id = nv.variable_id
                  AND va.variable_type_id = vt.variable_type_id
                  AND nv.node_id = $1
                  AND nv.component_id = $2`;

  const response = await pool.query(sql, [nodeId, componentId]);
  return response.rows;
};

const getNodeVariables = async (nodeId) => {
  const sql = ` SELECT 
                  co.component_id,
                  co.name AS component_name,
                  va.variable_id,
                  vt.type,
                  va.name AS variable_name,
                  va.unit
                FROM
                  component co,
                  variable va,
                  variable_type vt, 
                  node_variable nv
                WHERE
                  nv.component_id = co.component_id
                  AND nv.variable_id = va.variable_id
                  AND vt.variable_Type_id = va.variable_type_id
                  AND nv.node_id = $1`;

  const response = await pool.query(sql, [nodeId]);
  return response.rows;
};

const getState = async (nodeId) => {
  const sql = ` SELECT
                  ns.state
                FROM
                  node_state ns,
                  node no
                WHERE
                  ns.node_state_id = no.node_state_id
                  AND no.node_id = $1`;

  const response = await pool.query(sql, [nodeId]);
  return response.rows;
};

const create = async (workspaceId, nodeName, nodeType, nodeLocation, nodeVisibility, nodeCode) => {
  const sql = ` INSERT INTO node (
                  workspace_id,
                  name,
                  node_type_id,
                  location_id,
                  is_visible,
                  node_code
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING node_id`;
  const response = await pool.query(
    sql,
    [workspaceId, nodeName, nodeType, nodeLocation, nodeVisibility, nodeCode],
  );

  return response.rows[0];
};

const addComponents = async (nodeId, componentId) => {
  const sql = ` INSERT INTO node_component (
                  node_id,
                  component_id
                )
                VALUES ($1, $2)`;
  await pool.query(sql, [nodeId, componentId]);
};

const addVariables = async (nodeId, componentId, variableId) => {
  const sql = ` INSERT INTO node_variable (
                  node_id,
                  component_id,
                  variable_id
                )
                VALUES ($1, $2, $3)`;
  await pool.query(sql, [nodeId, componentId, variableId]);
};

const updateColumn = async (nodeId, column, value) => {
  const sql = ` UPDATE
                  node
                SET
                  ${column} = $1
                WHERE
                  node_id = $2`;
  await pool.query(sql, [value, nodeId]);
};

const areCoordinatesAvailablePublicly = async (location) => {
  const sql = ` SELECT EXISTS (
                  SELECT
                    no.node_id
                  from 
                    node no,
                    location lo
                  WHERE
                    no.is_visible is true
                    AND no.location_id = lo.location_id
                    AND lo.lat = $1
                    AND lo.long = $2
                )`;

  const response = await pool.query(sql, [location.lat, location.long]);
  return !response.rows[0].exists;
};

const isNameAvailableInWS = async (workspaceId, name) => {
  const sql = ` SELECT EXISTS (
                  SELECT
                    node_id
                  from 
                    node
                  WHERE
                    workspace_id = $1
                    AND name = $2
                )`;

  const response = await pool.query(sql, [workspaceId, name]);
  return !response.rows[0].exists;
};

const isNameAvailablePublicly = async (name) => {
  const sql = ` SELECT EXISTS (
                  SELECT
                    node_id
                  from 
                    node
                  WHERE
                    is_visible is true
                    AND name = $1
                )`;

  const response = await pool.query(sql, [name]);
  return !response.rows[0].exists;
};

const removeAllNodeComponents = async (nodeId) => {
  const sql = ` DELETE FROM 
                  node_component                
                WHERE 
                  node_id = $1`;
  await pool.query(sql, [nodeId]);
};

const removeAllNodeVariables = async (nodeId) => {
  const sql = ` DELETE FROM 
                  node_variable                
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

module.exports = {
  getTypes,
  getStates,
  getAll,
  getPublicNodes,
  getAccountNodes,
  getWorkspaceNodes,
  getOne,
  getOneWithNodeCode,
  checkNodeVariable,
  checkNodeCamera,
  getComponents,
  getVariables,
  getNodeVariables,
  getState,
  create,
  addComponents,
  addVariables,
  updateColumn,
  areCoordinatesAvailablePublicly,
  isNameAvailableInWS,
  isNameAvailablePublicly,
  removeAllNodeComponents,
  removeAllNodeVariables,
  remove,
};
