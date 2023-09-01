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

const getAllNodes = async () => {
  const response = await pool.query('SELECT * FROM node');
  return response.rows;
};

const deleteAllNodes = async () => {
  await pool.query('DELETE FROM node');
};

module.exports = {
  initialNodes,
  createNode,
  getAllNodes,
  deleteAllNodes,
};
