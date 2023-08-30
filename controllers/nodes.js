const pool = require('../connections/database');

/* Get all nodes */
const getAll = async (req, res) => {
  const sql = ` SELECT 
                  * 
                FROM
                  node`;

  const response = await pool.query(sql);
  res.send(response.rows);
};

/* Add a node */
const create = async (req, res) => {
  const { nodeType } = req.body;

  const type = (nodeType === 'OUTDOOR') ? 'outdoor' : 'indoor';
  const sql = ` INSERT INTO node (
                  node_type, 
                  node_id
                ) 
                VALUES ($1, nextval('${type}_nodes'))
                RETURNING *`;

  const response = await pool.query(sql, [nodeType]);
  res.send(response.rows);
};

module.exports = {
  getAll,
  create,
};
