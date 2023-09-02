const pool = require('../connections/database');

const initialNodes = [
  {
    node_type: 'INDOOR',
  },
  {
    node_type: 'OUTDOOR',
  },
  {
    node_type: 'OUTDOOR',
  },
];

const createNode = async (node) => {
  const type = (node.node_type === 'OUTDOOR') ? 'outdoor' : 'indoor';
  await pool.query(`INSERT INTO node (node_type,node_id) VALUES ($1, nextval('${type}_nodes'))`, [node.node_type]);
};

const createUserRole = async (userRole) => {
  await pool.query('INSERT INTO user_role (role_name) VALUES ($1)', [userRole.roleName]);
};

const createUserAccount = async (userAccount) => {
  const {
    firstName, lastName, email, password, roleId,
  } = userAccount;
  await pool.query('INSERT INTO user_account (first_name, last_name, email, password, role_id) VALUES ($1, $2, $3, $4, $5)', [firstName, lastName, email, password, roleId]);
};

const getRows = async (table) => {
  const response = await pool.query(`SELECT * FROM ${table}`);
  return response.rows;
};

const deleteRows = async (table) => {
  await pool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
};

module.exports = {
  initialNodes,
  createNode,
  createUserRole,
  createUserAccount,
  getRows,
  deleteRows,
};
