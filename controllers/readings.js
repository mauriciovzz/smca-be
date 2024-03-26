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

const getNodeReadings = async (req, res) => {
  const { nodeId, date } = req.params;

  const nodeVariables = await nodesService.getNodeVariables(nodeId);

  const dayReadings = [];

  const currentDate = new Date(date);
  const sundayDate = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
  const weekDates = [new Date(sundayDate)];

  while (sundayDate.setDate(sundayDate.getDate() + 1) && sundayDate.getDay() !== 0) {
    weekDates.push(new Date(sundayDate));
  }

  for (let i = 0; i < nodeVariables.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const dayAverages = await readingsService.getDayReadings(
      nodeId,
      nodeVariables[i].component_id,
      nodeVariables[i].variable_id,
      date,
    );

    const weekData = [];

    for (let j = 0; j < 7; j += 1) {
      // eslint-disable-next-line no-await-in-loop
      const dayRange = await readingsService.getDayRanges(
        nodeId,
        nodeVariables[i].component_id,
        nodeVariables[i].variable_id,
        date,
      );

      weekData.push({
        day: weekDates[j].getDay(),
        min: dayRange.min,
        max: dayRange.max,
      });
    }

    dayReadings.push({
      component_id: nodeVariables[i].component_id,
      component_name: nodeVariables[i].component_name,
      variable_id: nodeVariables[i].variable_id,
      type: nodeVariables[i].type,
      variable_name: nodeVariables[i].variable_name,
      unit: nodeVariables[i].unit,
      dayAverages,
      weekData,
    });
  }

  return res.status(200).send(dayReadings);
};

module.exports = {
  create,
  calculateReadingsAverages,
  getNodeReadings,
};
