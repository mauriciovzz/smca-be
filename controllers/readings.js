const readingsService = require('../services/readings');
const nodesService = require('../services/nodes');
const logger = require('../utils/logger');

const create = async (reading) => {
  try {
    const {
      nodeCode, componentId, variableId, readingDate, readingTime, readingValue,
    } = reading;

    const nodeInfo = nodesService.getOneWithNodeCode(nodeCode);
    const nodeVariables = nodesService.getVariables(nodeInfo.node_id);

    const hasVariable = nodeVariables
      .find((nv) => nv.component_id === componentId && nv.variable_id === variableId);

    if (nodeInfo.state === 'Activo' && hasVariable) {
      await readingsService.create(
        nodeInfo.node_id,
        componentId,
        variableId,
        nodeInfo.location_id,
        readingDate,
        readingTime,
        readingValue,
      );
    }
  } catch (err) {
    logger.error(`Saving reading error: ${err.message}`);
  }
};

const getAll = async (req, res) => {
  const {
    nodeType, nodeId, variableId, date,
  } = req.params;

  const readings = await readingsService.getAll(nodeType, nodeId, variableId, date);
  res.send(readings);
};

const calculateReadingsAverages = async (serverDate) => {
  const date = new Date(serverDate.toLocaleString('en-US', { timeZone: 'America/Caracas' }));
  const fullDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const endHour = date.getHours();
  const startTime = (date.getHours() === 0) ? 23 : date.getHours() - 1;

  const pastHourAverages = await readingsService.getPastHourAverages(fullDate, startTime);

  for (let i = 0; i < pastHourAverages.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await nodesService.createReadingsAverage(pastHourAverages[i], fullDate, endHour);
  }
};

module.exports = {
  create,
  getAll,
  calculateReadingsAverages,
};
