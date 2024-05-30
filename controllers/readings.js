const readingsService = require('../services/readings');
const nodesService = require('../services/nodes');
const logger = require('../utils/logger');

const create = async (reading) => {
  try {
    const {
      nodeCode, componentId, variableId, readingDate, readingTime, readingValue,
    } = reading;

    const foundNode = await nodesService.checkNodeVariable(nodeCode, componentId, variableId);

    if (foundNode) {
      await readingsService.create(
        foundNode.node_id,
        componentId,
        variableId,
        foundNode.location_id,
        readingDate,
        readingTime,
        parseFloat(readingValue),
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
    await readingsService.createReadingsAverage(pastHourAverages[i], fullDate, endHour);
  }

  await readingsService.deletePastHourReadings(fullDate, startTime);
};

const getUiInfo = async (req, res) => {
  const { nodeId, locationId, date } = req.params;
  const uiInfo = await readingsService.getUiInfo(nodeId, locationId, date);

  return res.status(200).send(uiInfo);
};

const getNodeReadings = async (req, res) => {
  const { nodeId, locationId, date } = req.params;
  const dayVariables = await readingsService.getDayVariables(nodeId, locationId, date);

  const dayReadings = [];

  // // Get week dates
  const currentDate = new Date(date);
  const sundayDate = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
  const weekDates = [new Date(sundayDate)];

  while (sundayDate.setDate(sundayDate.getDate() + 1) && sundayDate.getDay() !== 0) {
    weekDates.push(new Date(sundayDate));
  }

  for (let i = 0; i < dayVariables.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const dayAverages = await readingsService.getDayReadings(
      nodeId,
      locationId,
      dayVariables[i].variable_id,
      date.toISOString().split('T')[0],
    );

    const weekData = [];

    for (let j = 0; j < weekDates.length; j += 1) {
      // eslint-disable-next-line no-await-in-loop
      const dayRange = await readingsService.getDayRanges(
        nodeId,
        locationId,
        dayVariables[i].variable_id,
        weekDates[j].toISOString().split('T')[0],
      );

      weekData.push({
        day: weekDates[j].getDay(),
        weekDay: weekDates[j],
        min: dayRange.min,
        max: dayRange.max,
      });
    }

    dayReadings.push({
      type: dayVariables[i].type,
      variable_id: dayVariables[i].variable_id,
      variable_name: dayVariables[i].name,
      unit: dayVariables[i].unit,
      color: dayVariables[i].color,
      dayAverages,
      weekData,
    });
  }

  return res.status(200).send(dayReadings);
};

module.exports = {
  create,
  calculateReadingsAverages,
  getUiInfo,
  getNodeReadings,
};
