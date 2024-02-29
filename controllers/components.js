const componentsService = require('../services/components');
const variablesService = require('../services/variables');

const getTypes = async (req, res) => {
  const componentTypes = await componentsService.getTypes();
  return res.status(200).send(componentTypes);
};

const getAll = async (req, res) => {
  const { workspaceId } = req.params;

  const components = await componentsService.getAll(workspaceId);

  const componentsInfo = [];
  for (let i = 0; i < components.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const variables = await componentsService.getVariables(components[i].component_id);

    componentsInfo.push({
      component_id: components[i].component_id,
      name: components[i].name,
      datasheet_link: components[i].datasheet_link,
      type: components[i].type,
      variables,
    });
  }

  return res.status(200).send(componentsInfo);
};

const create = async (req, res) => {
  const { workspaceId } = req.params;
  const {
    name, datasheetLink, componentType, variables,
  } = req.body;

  const componentTypes = await componentsService.getTypes();
  const isSensor = (componentTypes.find((ct) => ct.component_type_id === componentType).type === 'Sensor');

  if (await componentsService.checkColumn(workspaceId, 'name', name.toLowerCase())) {
    return res.status(409).json({ error: 'El nombre de componente ingresado ya se encuentra registrado.' });
  }

  if (isSensor) {
    if (variables.length === 0) {
      return res.status(409).json({ error: 'El componente debe contener al menos una variable.' });
    }

    const workspaceVariables = await variablesService.getAll(workspaceId);
    const workspaceVariablesIds = workspaceVariables.map((variable) => variable.variable_id);
    if (!variables.every((variable) => workspaceVariablesIds.includes(variable))) {
      return res.status(404).json({ error: 'Al menos una variable no se encuentra registrada.' });
    }
  }

  const component = await componentsService.create(
    workspaceId,
    name.toLowerCase(),
    datasheetLink.toLowerCase(),
    componentType,
  );

  if (isSensor) {
    for (let i = 0; i < variables.length; i += 1) {
      // eslint-disable-next-line
      await componentsService.addVariable(
        component.component_id,
        variables[i],
      );
    }
  }

  return res.status(201).send('Component creada exitosamente.');
};

const update = async (req, res) => {
  const { workspaceId, componentId } = req.params;
  const { name, datasheetLink, variables } = req.body;

  const originalComponent = await componentsService.getOne(workspaceId, componentId);
  const isSensor = originalComponent.type === 'Sensor';

  let variablesEliminadas = [];
  let variablesAgregadas = [];

  if (isSensor) {
    const componentVariables = await componentsService.getVariables(componentId);
    const originalVariables = componentVariables.map((v) => v.variable_id);

    variablesEliminadas = originalVariables.filter((id) => !variables.includes(id));
    for (let i = 0; i < variablesEliminadas.length; i += 1) {
      // eslint-disable-next-line
      const isUsed = await componentsService.isComponentVariableBeingUsed(componentId, variablesEliminadas[i]);
      if (isUsed) {
        return res.status(401).json({
          error: `La variable ${componentVariables.find((cv) => cv.variable_id === variablesEliminadas[i]).name} se encuentra en uso.`,
        });
      }
    }

    variablesAgregadas = variables.filter((id) => !originalVariables.includes(id));
    for (let i = 0; i < variablesAgregadas.length; i += 1) {
      // eslint-disable-next-line
      const exist = await variablesService.getOne(workspaceId, variablesAgregadas[i]);
      if (!exist) {
        return res.status(401).json({
          error: 'Una de las variables agregadas no se encuentra registrada.',
        });
      }
    }
  }

  if (!(originalComponent.name === name.toLowerCase())) {
    if (await componentsService.checkColumn(workspaceId, 'name', name.toLowerCase())) {
      return res.status(409).json({ error: 'El nombre de componente ingresado ya se encuentra registrado.' });
    }
  }

  await componentsService.update(
    workspaceId,
    componentId,
    name.toLowerCase(),
    datasheetLink.toLowerCase(),
  );

  if (isSensor) {
    for (let i = 0; i < variablesEliminadas.length; i += 1) {
      // eslint-disable-next-line
      await componentsService.removeVariable(componentId, variablesEliminadas[i]);
    }

    for (let i = 0; i < variablesAgregadas.length; i += 1) {
      // eslint-disable-next-line
      await componentsService.addVariable(componentId, variablesAgregadas[i]);
    }
  }

  return res.status(201).send('Componente actualizado exitosamente.');
};

const remove = async (req, res) => {
  const { workspaceId, componentId } = req.params;

  if (await componentsService.isBeingUsed(componentId)) {
    return res.status(401).json({ error: 'El componente se encuentra en uso.' });
  }

  await componentsService.remove(workspaceId, componentId);
  return res.status(200).send('Componente eliminado exitosamente.');
};

module.exports = {
  getTypes,
  getAll,
  create,
  update,
  remove,
};

// const update = async (req, res) => {
//   const {
//     componentId,
//     componentType,
//     componentName,
//     datasheetLink,
//     variables,
//   } = req.body;

//   const sql = ` UPDATE
//                   component
//                 SET
//                   component_type = $1,
//                   component_name = $2,
//                   datasheet_link = $3
//                 WHERE
//                   component_id = $4`;

//   await pool.query(sql, [componentType, componentName, datasheetLink, componentId]);

//   if (componentType === 'SENSOR') {
//     const sqlVariables = `  SELECT
//                               variable_id
//                             FROM
//                               component_variable
//                             WHERE
//                               component_id = $1`;
//     const dbVariables = await pool.query(sqlVariables, [componentId]);

//     // Delete Variables
//     const deletedVariables = dbVariables.rows
//       .filter((e) => !variables.includes(e.variable_id)).map((ee) => ee.variable_id);

//     const deleteSql = ` DELETE FROM
//                           component_variable
//                         WHERE
//                           component_id = $1
//                         AND
//                           variable_id  = $2`;

//     for (let i = 0; i < deletedVariables.length; i += 1) {
//       // eslint-disable-next-line
//       await pool.query(deleteSql, [componentId, deletedVariables[i]]);
//     }

//     // Add Variables
//     const addedVariables = variables
//       .filter((e) => !dbVariables.rows.map((ee) => ee.variable_id).includes(e));

//     const addSql = `  INSERT INTO component_variable (component_id, variable_id)
//                       VALUES ($1, $2)`;

//     for (let i = 0; i < addedVariables.length; i += 1) {
//       // eslint-disable-next-line
//       await pool.query(addSql, [componentId, addedVariables[i]]);
//     }
//   }

//   return res.sendStatus(201);
// };

// const remove = async (req, res) => {
//   const { componentType, componentId } = req.params;

//   let sql = ` SELECT EXISTS (
//                 SELECT
//                   *
//                 FROM
//                   node_component
//                 WHERE
//                   component_id = $1
//               ) AS "exists"`;
//   const componentFound = await pool.query(sql, [componentId]);

//   if (componentFound.rows[0].exists) {
//     return res.status(401).json({
//       error: 'El componente se encuentra en uso.',
//     });
//   }

//   if (componentType === 'SENSOR') {
//     const variablesSql = `  DELETE FROM
//                             component_variable
//                             WHERE
//                               component_id = $1`;
//     await pool.query(variablesSql, [componentId]);
//   }

//   sql = ` DELETE FROM
//             component
//           WHERE
//             component_id = $1`;

//   await pool.query(sql, [componentId]);
//   return res.sendStatus(204);
// };

// module.exports = {
//   getAll,
//   create,
//   update,
//   remove,
// };
