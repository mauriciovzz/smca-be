const pool = require('../../utils/databaseHelper');

const getAll = async (req, res) => {
  const sql = ` SELECT 
                  *
                FROM variable`;
  const variableList = await pool.query(sql);

  return res.status(201).send(variableList.rows);
};

const create = async (req, res) => {
  const {
    variableType,
    variableName,
    unit,
  } = req.body;

  const sql = ` INSERT INTO variable (variable_type, variable_name, unit)
                VALUES ($1, $2, $3)`;

  await pool.query(sql, [variableType, variableName, unit]);
  return res.sendStatus(201);
};

const update = async (req, res) => {
  const {
    variableId,
    variableName,
    unit,
    variableType,
  } = req.body;

  const sql = ` UPDATE 
                  variable
                SET
                  variable_name = $1,
                  unit = $2,
                  variable_type = $3
                WHERE
                  variable_id = $4`;

  await pool.query(sql, [variableName, unit, variableType, variableId]);
  return res.sendStatus(201);
};

const remove = async (req, res) => {
  const { variableId } = req.params;

  let sql = ` SELECT EXISTS (
                SELECT
                  *
                FROM 
                  component_variable 
                WHERE 
                  variable_id = $1
              ) AS "exists"`;
  const variableFound = await pool.query(sql, [variableId]);

  if (variableFound.rows[0].exists) {
    return res.status(401).json({
      error: 'La variable se encuentra en uso.',
    });
  }

  sql = ` DELETE FROM 
            variable                
          WHERE 
            variable_id = $1`;

  await pool.query(sql, [variableId]);
  return res.sendStatus(204);
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};

