const crypto = require('node:crypto');
const { once } = require('events');
const fs = require('node:fs');
const yazl = require('yazl');
const config = require('../config/config');
const { criteriaPollutants, meteorologyVariables } = require('../config/systemVariables');

const nodesService = require('../services/nodes');
const locationsService = require('../services/locations');
const componentsService = require('../services/components');
const variablesService = require('../services/variables');
const readingsService = require('../services/readings');

const CustomError = require('../utils/CustomError');

const helperGetComponents = async (nodeId) => {
  const components = await nodesService.getComponents(nodeId);

  const componentsData = [];

  for (let i = 0; i < components.length; i += 1) {
    let variables = [];

    if (components[i].type === 'sensor')
      variables = await nodesService.getNodeComponentVariables(nodeId, components[i].component_id);

    componentsData.push({
      component_id: components[i].component_id,
      type: components[i].type,
      name: components[i].name,
      datasheet_link: components[i].datasheet_link,
      variables,
    });
  }

  return componentsData;
};

const helperCheckComponents = async (components, spaceId, next) => {
  // check components min / max values
  const componentsCount = components.reduce(
    (componentTypes, currentObj) => {
      if (componentTypes[currentObj.type] !== undefined)
        componentTypes[currentObj.type] += 1;

      return componentTypes;
    },
    {
      board: 0, sensor: 0, rain_detector: 0, camera: 0,
    },
  );

  if (componentsCount.board === 0)
    return next(new CustomError('El nodo necesita por lo menos una placa.', 409));

  if (componentsCount.sensor + componentsCount.camera + componentsCount.rain_detector === 0)
    return next(new CustomError('El nodo necesita por lo menos un componente que realice algún tipo de lectura (sensor, detector de lluvia o cámara).', 409));

  if (componentsCount.rain_detector > 1)
    return next(new CustomError('El nodo solo puede poseer un detector de lluvia.', 409));

  if (componentsCount.camera > 1)
    return next(new CustomError('El nodo solo puede poseer una camara.', 409));

  const nodeVariablesCount = components.reduce(
    (accumulator, currentObj) => (currentObj.variables.length !== 0
      ? currentObj.variables.length + accumulator
      : accumulator
    ),
    0,
  );

  if (nodeVariablesCount + componentsCount.rain_detector === 0)
    return next(new CustomError('El nodo necesita por lo menos 1 variable.', 409));

  if (nodeVariablesCount > 11)
    return next(new CustomError('El nodo solo puede poseer 11 variables.', 409));

  // check components and variables exists
  const spaceComponents = await componentsService.getAll(spaceId);
  const spaceComponentsIds = spaceComponents.map((c) => c.component_id);

  for (let i = 0; i < components.length; i += 1) {
    if (!spaceComponentsIds.includes(components[i].componentId))
      return next(new CustomError('ComponentDoesNotExists', 404));

    if (components[i].type === 'sensor') {
      const componentVariables = await componentsService.getVariables(components[i].componentId);
      const componentVariablesIds = componentVariables.map((v) => v.variable_id);

      if (!components[i].variables.every((v) => componentVariablesIds.includes(v)))
        return next(new CustomError('VariableDoesNotExist', 404));
    }
  }

  return null;
};

const helperAddComponents = async (components, nodeId, spaceId) => {
  for (let i = 0; i < components.length; i += 1) {
    await nodesService.addComponent(
      nodeId,
      components[i].componentId,
    );

    if (components[i].type === 'sensor') {
      for (let j = 0; j < components[i].variables.length; j += 1) {
        await nodesService.addVariable(
          nodeId,
          components[i].componentId,
          components[i].variables[j],
        );
      }
    }

    if (components[i].type === 'rain_detector') {
      const rainVariable = await variablesService.getRainVariable(spaceId);

      await nodesService.addVariable(
        nodeId,
        components[i].componentId,
        rainVariable.variable_id,
      );
    }
  }
};

const helperCheckNameUniqueness = async (spaceId, name, next) => {
  if (await nodesService.isNameTaken(spaceId, name.toLowerCase()))
    return next(new CustomError('El nombre ingresado ya se encuentra registrado.', 409));

  return null;
};

const getCurrentDateTime = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');

  return {
    date: `${year}-${month}-${day}`,
    hour,
  };
};

const getNodesCurrentReadings = async (nodes) => {
  const dateTime = getCurrentDateTime();

  const response = [];

  for (let i = 0; i < nodes.length; i += 1) {
    response.push(nodes[i]);

    response[i].current_readings = {
      'pm2.5': {
        con: null,
        aqi: null,
      },
      pm10: {
        con: null,
        aqi: null,
      },
      o3: {
        con: null,
        aqi: null,
      },
      no2: {
        con: null,
        aqi: null,
      },
      so2: {
        con: null,
        aqi: null,
      },
      co: {
        con: null,
        aqi: null,
      },
      temperatura: null,
      humedad: null,
      presión: null,
      precipitación: null,
      'radiación solar': null,
    };

    const nodeVariables = await nodesService.getVariables(nodes[i].node_id);

    const cp = criteriaPollutants.map((v) => v.name);
    const mv = meteorologyVariables.map((v) => v.name);

    for (let j = 0; j < nodeVariables.length; j += 1) {
      if (cp.includes(nodeVariables[j].name)) {
        const readingValue = await readingsService.getVariableCurrentValue(
          dateTime.date,
          dateTime.hour,
          nodes[i].node_id,
          nodeVariables[j].variable_id,
        );

        if (readingValue !== undefined)
          response[i].current_readings[nodeVariables[j].name].con = readingValue;

        const aqiValue = await readingsService.getVariableCurrentAQI(
          dateTime.date,
          dateTime.hour,
          nodes[i].node_id,
          nodeVariables[j].variable_id,
        );

        if (aqiValue !== undefined)
          response[i].current_readings[nodeVariables[j].name].aqi = aqiValue;
      }

      if (mv.includes(nodeVariables[j].name)) {
        const readingValue = await readingsService.getVariableCurrentValue(
          dateTime.date,
          dateTime.hour,
          nodes[i].node_id,
          nodeVariables[j].variable_id,
        );

        if (readingValue !== undefined)
          response[i].current_readings[nodeVariables[j].name] = readingValue;
      }
    }
  }

  return response;
};

// Config file functions
const createInoFile = async (newFilePath, nodeData) => {
  const originalFilePath = 'temp/node_config_file.ino';

  const originalContent = fs.readFileSync(originalFilePath, 'utf-8');
  const modifiedContent = `#include "node_${nodeData.node_code}_config.h"\n${originalContent}`;

  fs.writeFileSync(newFilePath, modifiedContent);
};

const createHFile = async (filePath, nodeData) => {
  const writer = fs.createWriteStream(filePath, { flags: 'w' });

  writer.write('// SMCA NODE CONFIG FILE\n');
  writer.write(`// NODE: ${nodeData.name}\n`);
  writer.write(`// DATE: ${new Date().toString()} \n\n`);

  writer.write('// MQTT\n');
  writer.write(`#define MQTT_HOST "${config.MQTT_HOST}"\n`);
  writer.write(`#define MQTT_PORT ${config.MQTT_PORT}\n`);
  writer.write(`#define MQTT_USERNAME "${config.MQTT_USERNAME}"\n`);
  writer.write(`#define MQTT_PASSWORD "${config.MQTT_PASSWORD}"\n`);
  writer.write(`#define MQTT_READING_TOPIC "${config.MQTT_READING_TOPIC}"\n`);
  writer.write(`#define MQTT_PHOTO_TOPIC "${config.MQTT_PHOTO_TOPIC}"\n\n`);

  writer.write('// NODE INFO\n');
  writer.write(`#define NODE_CODE "${nodeData.node_code}"\n\n`);

  const allComponents = await nodesService.getComponents(nodeData.node_id);
  const readerComponents = allComponents.filter((c) => !['board', 'other'].includes(c.type));

  for (let i = 0; i < readerComponents.length; i += 1) {
    const componentMacro = readerComponents[i].name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\W/g, '_');
    writer.write(`#define ${componentMacro} "${readerComponents[i].component_id}"\n`);

    const variables = await nodesService.getNodeComponentVariables(
      nodeData.node_id,
      readerComponents[i].component_id,
    );

    for (let j = 0; j < variables.length; j += 1) {
      const variableMacro = `${readerComponents[i].name}_${variables[j].name}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\W/g, '_');
      writer.write(`#define ${variableMacro} "${variables[j].variable_id}"\n`);
    }
    writer.write('\n');
  }
  writer.end();
  await once(writer, 'finish');
};

// Endpoint functions

const getHomePageNodes = async (req, res) => {
  const { accountId } = req;

  const nodes = await nodesService.getHomePageNodes(accountId);
  const homePageNodes = await getNodesCurrentReadings(nodes);

  return res.status(200).send(homePageNodes);
};

const getSpaceNodes = async (req, res) => {
  const { spaceId } = req.params;

  const nodes = await nodesService.getSpaceNodes(spaceId);
  const spaceNodes = await getNodesCurrentReadings(nodes);

  return res.status(200).send(spaceNodes);
};

const getSpaceNodesInfo = async (req, res) => {
  const { spaceId } = req.params;

  const nodes = await nodesService.getSpaceNodesInfo(spaceId);

  return res.status(200).send(nodes);
};

const create = async (req, res, next) => {
  const { spaceId } = req;
  const { name, readingInterval, isIndoor, locationId, components } = req.body;

  // check name uniqueness
  await helperCheckNameUniqueness(spaceId, name, next);

  // check location existence / availability
  if (locationId) {
    const locationData = await locationsService.find(locationId, spaceId);

    if (!locationData)
      return next(new CustomError('LocationDoesNotExist', 404));

    if (locationData.is_taken)
      return next(new CustomError('LocationInUse', 409));
  }

  // check components
  await helperCheckComponents(components, spaceId, next);

  // create
  let nodeCode = crypto.randomBytes(4).toString('hex').toUpperCase();
  let checkCode = true;

  while (checkCode) {
    const isCodeTaken = await nodesService.isNodeCodeTaken(nodeCode);

    if (isCodeTaken) {
      nodeCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    } else {
      checkCode = false;
    }
  }

  const newNode = await nodesService.create(
    nodeCode,
    spaceId,
    name.toLowerCase(),
    readingInterval,
    isIndoor,
    locationId,
    locationId ? new Date() : null,
  );

  if (locationId)
    await locationsService.updateIsTaken(locationId, true);

  await helperAddComponents(components, newNode.node_id, spaceId);

  return res.sendStatus(201);
};

const getComponents = async (req, res) => {
  const { nodeData } = req;

  const componentsData = await helperGetComponents(nodeData.node_id);

  return res.status(200).send(componentsData);
};

const getConfigFile = async (req, res) => {
  const { nodeData } = req;

  const inoFilePath = `temp/node_${nodeData.node_code}.ino`;
  await createInoFile(inoFilePath, nodeData);

  const hFilePath = `temp/node_${nodeData.node_code}_config.h`;
  await createHFile(hFilePath, nodeData);

  const zipfile = new yazl.ZipFile();

  zipfile.addFile(inoFilePath, `node_${nodeData.node_code}.ino`);
  zipfile.addFile(hFilePath, `node_${nodeData.node_code}_config.h`);

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=node_${nodeData.node_code}_config_files.zip`);

  zipfile.outputStream.pipe(res);

  zipfile.outputStream.on('close', () => {
    fs.unlinkSync(inoFilePath);
    fs.unlinkSync(hFilePath);
  });

  zipfile.end();
};

const updateInfo = async (req, res, next) => {
  const { spaceId, nodeData } = req;
  const { name, isIndoor, readingInterval, isActive } = req.body;

  if (name.toLowerCase() !== nodeData.name)
    await helperCheckNameUniqueness(spaceId, name, next);

  if (isActive && !nodeData.location_id)
    return next(new CustomError('No se puede activar un nodo que no posea ubicación.', 409));

  await nodesService.updateInfo(
    nodeData.node_id,
    name,
    isIndoor,
    readingInterval,
    isActive,
  );

  return res.status(201).send('Nodo actualizado exitosamente.');
};

const updateLocation = async (req, res, next) => {
  const { spaceId, nodeData } = req;
  const { location } = req.body;

  if (location) {
    const locationData = await locationsService.find(location, spaceId);

    if (!locationData)
      return next(new CustomError('La ubicación indicada no se encuentra registrada.', 404));

    if (locationData.is_taken)
      return next(new CustomError('La ubicación indicada se encuentra en uso.', 404));

    await locationsService.updateIsTaken(
      location,
      true,
    );
  }

  if (nodeData.location_id)
    await locationsService.updateIsTaken(nodeData.location_id, false);

  await nodesService.updateLocation(
    nodeData.node_id,
    location,
    (location) ? new Date() : null,
  );

  await nodesService.inactivate(nodeData.node_id);

  return res.status(201).send('Ubicación actualizada exitosamente.');
};

const updateComponents = async (req, res, next) => {
  const { spaceId, nodeData } = req;
  const { components } = req.body;

  await helperCheckComponents(components, spaceId, next);
  await nodesService.removeComponents(nodeData.node_id);
  await helperAddComponents(components, nodeData.node_id, spaceId);
  await nodesService.inactivate(nodeData.node_id);

  return res.status(201).send('Componentes actualizados exitosamente.');
};

const remove = async (req, res) => {
  const { nodeData } = req;

  if (nodeData.location_id)
    await locationsService.updateIsTaken(nodeData.location_id, false);

  await nodesService.remove(nodeData.node_id);

  return res.status(200).send('Nodo eliminado exitosamente.');
};

module.exports = {
  getHomePageNodes,
  getSpaceNodes,
  getSpaceNodesInfo,
  create,
  getComponents,
  getConfigFile,
  updateInfo,
  updateLocation,
  updateComponents,
  remove,
};
