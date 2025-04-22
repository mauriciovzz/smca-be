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
      return next(new CustomError('NewComponentVariableDoesNotExist', 404));
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

  return res.status(201).send('Componente creado exitosamente.');
};

const getAll = async (req, res) => {
  const { spaceId } = req;

  const components = await componentsService.getAll(spaceId);

  const componentsData = [];

  for (let i = 0; i < components.length; i += 1) {
    let variables = [];

    if (components[i].type === 'sensor')
      variables = await componentsService.getVariables(components[i].component_id);

    componentsData.push({
      component_id: components[i].component_id,
      type: components[i].type,
      name: components[i].name,
      datasheet_link: components[i].datasheet_link,
      variables,
    });
  }

  return res.status(200).send(componentsData);
};

const update = async (req, res, next) => {
  const { spaceId, componentData } = req;
  const { name, datasheetLink, variables } = req.body;

  const varsToUpdate = [];

  if (componentData.type === 'sensor') {
    const spaceVariables = await variablesService.getAll(spaceId);
    const spaceVariablesIds = spaceVariables.map((v) => v.variable_id);

    const compVars = await componentsService.getVariables(componentData.component_id);
    const compVarsIds = compVars.map((v) => v.variable_id);

    const compVarsBeingUsed = await componentsService.getVarsBeingUsed(componentData.component_id);

    // check / filter variables to add
    const varsToAdd = variables.filter((v) => v.action === 'add');

    if (!varsToAdd.every((v) => spaceVariablesIds.includes(v.variableId)))
      return next(new CustomError('NewComponentVariableDoesNotExist', 404));

    varsToAdd.forEach((v) => {
      if (!compVarsIds.includes(v.variableId))
        varsToUpdate.push(v);
    });

    // check / filter variables to remove
    const varsToRemove = variables.filter((v) => v.action === 'remove');

    const isVarBeingUsed = varsToRemove.filter((v) => compVarsBeingUsed.includes(v.variableId));
    if (isVarBeingUsed.length > 0) {
      const errorVar = spaceVariables.find((v) => v.variable_id === isVarBeingUsed[0].variableId);
      return next(new CustomError(`La variable "${errorVar.name}" se encuentra en uso en un nodo, por lo que no puede ser eliminada.`, 409));
    }

    varsToRemove.forEach((v) => {
      if (compVarsIds.includes(v.variableId))
        varsToUpdate.push(v);
    });
  }

  if (await componentsService.isNameTaken(spaceId, componentData.component_id, name.toUpperCase()))
    return next(new CustomError('El nombre ingresado ya se encuentra registrado.', 409));

  await componentsService.update(
    componentData.component_id,
    name.toUpperCase(),
    datasheetLink,
  );

  if (componentData.type === 'sensor') {
    for (let i = 0; i < varsToUpdate.length; i += 1) {
      if (varsToUpdate[i].action === 'add')
        await componentsService.addVariable(
          componentData.component_id,
          varsToUpdate[i].variableId,
        );
      else
        await componentsService.removeVariable(
          componentData.component_id,
          varsToUpdate[i].variableId,
        );
    }
  }

  return res.status(201).send('Componente actualizado exitosamente.');
};

const remove = async (req, res, next) => {
  const { componentData } = req;

  if (await componentsService.isComponentBeingUsed(componentData.component_id))
    return next(new CustomError('El componente esta siendo uitilizado por un nodo.', 409));

  await componentsService.remove(
    componentData.component_id,
  );

  return res.status(200).send('Componente eliminado exitosamente.');
};

module.exports = {
  create,
  getAll,
  update,
  remove,
};
