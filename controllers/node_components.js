const pool = require('../connections/database');

/* Add node component */
const create = async (req, res) => {
  const { nodeType, nodeId, componentId } = req.body;
  const sql = ` INSERT INTO node_component 
                VALUES ($1, $2, $3)
                RETURNING *`;

  const response = await pool.query(sql, [nodeType, nodeId, componentId]);
  res.send(response.rows);
};

module.exports = {
  create,
};
