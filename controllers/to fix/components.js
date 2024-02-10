const pool = require('../../utils/databaseHelper');

const getAll = async (req, res) => {
  const sql = ` SELECT 
                  *
                FROM component`;
  const componentList = await pool.query(sql);

  const componentData = [];
  for (let i = 0; i < componentList.rows.length; i += 1) {
    const sqlAverages = ` SELECT 
                            v.variable_id,
                            variable_type,
                            variable_name,
                            unit
                          FROM variable v
                          INNER JOIN component_variable cv 
                            ON  v.variable_id   = cv.variable_id
                            AND cv.component_id = $1`;
    // eslint-disable-next-line
    const variableList = await pool.query(sqlAverages, [componentList.rows[i].component_id]);

    componentData.push({
      component_id: componentList.rows[i].component_id,
      component_name: componentList.rows[i].component_name,
      component_type: componentList.rows[i].component_type,
      datasheet_link: componentList.rows[i].datasheet_link,
      component_variables: variableList.rows,
    });
  }

  return res.status(201).send(componentData);
};

const create = async (req, res) => {
  const {
    componentType,
    componentName,
    datasheetLink,
    variables,
  } = req.body;

  const sql = ` INSERT INTO component (component_type, component_name, datasheet_link)
                VALUES ($1, $2, $3)
                RETURNING *`;

  const response = await pool.query(sql, [componentType, componentName, datasheetLink]);

  if (componentType === 'SENSOR') {
    const sqlVariables = `  INSERT INTO component_variable (component_id, variable_id)
                            VALUES ($1, $2)`;

    for (let i = 0; i < variables.length; i += 1) {
      // eslint-disable-next-line
      await pool.query(sqlVariables, [response.rows[0].component_id, variables[i]]);
    }
  }

  return res.sendStatus(201);
};

const update = async (req, res) => {
  const {
    componentId,
    componentType,
    componentName,
    datasheetLink,
    variables,
  } = req.body;

  const sql = ` UPDATE 
                  component
                SET
                  component_type = $1,
                  component_name = $2,
                  datasheet_link = $3
                WHERE
                  component_id = $4`;

  await pool.query(sql, [componentType, componentName, datasheetLink, componentId]);

  if (componentType === 'SENSOR') {
    const sqlVariables = `  SELECT 
                              variable_id
                            FROM
                              component_variable
                            WHERE
                              component_id = $1`;
    const dbVariables = await pool.query(sqlVariables, [componentId]);

    // Delete Variables
    const deletedVariables = dbVariables.rows
      .filter((e) => !variables.includes(e.variable_id)).map((ee) => ee.variable_id);

    const deleteSql = ` DELETE FROM
                          component_variable
                        WHERE
                          component_id = $1
                        AND
                          variable_id  = $2`;

    for (let i = 0; i < deletedVariables.length; i += 1) {
      // eslint-disable-next-line
      await pool.query(deleteSql, [componentId, deletedVariables[i]]);
    }

    // Add Variables
    const addedVariables = variables
      .filter((e) => !dbVariables.rows.map((ee) => ee.variable_id).includes(e));

    const addSql = `  INSERT INTO component_variable (component_id, variable_id)
                      VALUES ($1, $2)`;

    for (let i = 0; i < addedVariables.length; i += 1) {
      // eslint-disable-next-line
      await pool.query(addSql, [componentId, addedVariables[i]]);
    }
  }

  return res.sendStatus(201);
};

const remove = async (req, res) => {
  const { componentType, componentId } = req.params;

  let sql = ` SELECT EXISTS (
                SELECT
                  *
                FROM 
                  node_component 
                WHERE 
                  component_id = $1
              ) AS "exists"`;
  const componentFound = await pool.query(sql, [componentId]);

  if (componentFound.rows[0].exists) {
    return res.status(401).json({
      error: 'El componente se encuentra en uso.',
    });
  }

  if (componentType === 'SENSOR') {
    const variablesSql = `  DELETE FROM
                            component_variable
                            WHERE
                              component_id = $1`;
    await pool.query(variablesSql, [componentId]);
  }

  sql = ` DELETE FROM 
            component                
          WHERE 
            component_id = $1`;

  await pool.query(sql, [componentId]);
  return res.sendStatus(204);
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
