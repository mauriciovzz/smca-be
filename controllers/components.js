const componentsService = require('../services/components');
const variablesService = require('../services/variables');
const CustomError = require('../utils/CustomError');

const create = async (req, res, next) => {
  const { spaceId } = req;
  const {
    type, name, datasheetLink, variables,
  } = req.body;

  if (await componentsService.isNameTaken(spaceId, null, name.toUpperCase()))
    return next(new CustomError('El nombre ingresado ya se encuentra registrado.', 409));

  if (type === 'sensor') {
    if (variables.length === 0)
      return next(new CustomError('El componente debe contener al menos una variable.', 409));

    const spaceVariables = await variablesService.getAll(spaceId);
    const spaceVariablesIds = spaceVariables.map((variable) => variable.variable_id);

    if (!variables.every((variable) => spaceVariablesIds.includes(variable)))
      return next(new CustomError('Una de las variables agregadas no se encuentra registrada.', 404));
  }

  const newComponent = await componentsService.create(
    spaceId,
    type,
    name.toUpperCase(),
    datasheetLink,
  );

  if (type === 'sensor') {
    for (let i = 0; i < variables.length; i += 1) {
      await componentsService.addVariable(
        newComponent.component_id,
        variables[i],
      );
    }
  }

  if (type === 'rain_detector') {
    const rainVariable = await variablesService.getRainVariable(spaceId);

    await componentsService.addVariable(
      newComponent.component_id,
      rainVariable[0].variable_id,
    );
  }

  return res.status(201).send('Componente creado exitosamente.');
};

const getAll = async (req, res) => {
  const { spaceId } = req;

  const components = await componentsService.getAll(spaceId);

  const componentsInfo = [];

  for (let i = 0; i < components.length; i += 1) {
    let variables = null;

    if (components[i].type === 'sensor')
      variables = await componentsService.getVariables(components[i].component_id);

    if (components[i].type === 'rain_detector')
      variables = await variablesService.getRainVariable(spaceId);

    componentsInfo.push({
      component_id: components[i].component_id,
      type: components[i].type,
      name: components[i].name,
      datasheet_link: components[i].datasheet_link,
      variables,
    });
  }

  return res.status(200).send(componentsInfo);
};

// to check
const update = async (req, res, next) => {
  const { spaceId, componentData } = req;
  const { name, datasheetLink, variables } = req.body;

  const variablesToUpdate = [];

  if (componentData.type === 'sensor') {
    const spaceVariables = await variablesService.getAll(spaceId);
    const spaceVariablesIds = spaceVariables.map((v) => v.variable_id);

    const componentVariables = await componentsService.getVariables(componentData.component_id);
    const componentVariablesIds = componentVariables.map((v) => v.variable_id);

    // check / filter variables to add
    const variablesToAdd = variables.filter((v) => v.action === 'add');

    if (!variablesToAdd.every((v) => spaceVariablesIds.includes(v.variableId)))
      return next(new CustomError('Una de las variables agregadas no se encuentra registrada.', 404));

    variablesToAdd.forEach((v) => {
      if (!componentVariablesIds.includes(v.variableId))
        variablesToUpdate.push(v);
    });

    // check / filter variables to remove
    const variablesToRemove = variables.filter((v) => v.action === 'remove');

    variablesToRemove.forEach((v) => {
      if (componentVariablesIds.includes(v.variableId))
        variablesToUpdate.push(v);
    });

    // chequear que no esten en uso
  }

  if (await componentsService.isNameTaken(spaceId, componentData.component_id, name.toUpperCase()))
    return next(new CustomError('El nombre ingresado ya se encuentra registrado.', 409));

  await componentsService.update(
    componentData.component_id,
    name.toUpperCase(),
    datasheetLink,
  );

  if (componentData.type === 'sensor') {
    for (let i = 0; i < variablesToUpdate.length; i += 1) {
      if (variablesToUpdate[i].action === 'add')
        await componentsService.addVariable(
          componentData.component_id,
          variablesToUpdate[i].variableId,
        );
      else
        await componentsService.removeVariable(
          componentData.component_id,
          variablesToUpdate[i].variableId,
        );
    }
  }

  return res.status(201).send('Componente actualizado exitosamente.');
};

// to check
const remove = async (req, res) => {
  const { componentId } = req.params;

  // if (await componentsService.isBeingUsed(componentId)) {
  //   return res.status(401).json({ error: 'El componente se encuentra en uso.' });
  // }

  await componentsService.remove(
    componentId,
  );

  return res.status(200).send('Componente eliminado exitosamente.');
};

module.exports = {
  create,
  getAll,
  update,
  remove,
};
