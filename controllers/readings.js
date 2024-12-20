const readingsService = require('../services/readings');
const nodesService = require('../services/nodes');
const logger = require('../utils/logger');

const create = async (reading) => {
  try {
    const isEmpty = Object.values(reading).every((x) => x === null || x === '');

    if (!isEmpty) {
      const { nodeCode, readingDate, readingTime, variableId, readingValue } = reading;

      const node = await nodesService.checkNodeAndVariable(nodeCode, variableId);

      if (node) {
        await readingsService.create(
          node.node_id,
          node.location_id,
          variableId,
          readingDate,
          readingTime,
          parseFloat(readingValue),
        );
      }
    }
  } catch (err) {
    logger.error(`Saving reading error: ${err.message}`);
  }
};

const calculateAverages = async (date, currentHour) => {
  const pastHour = (currentHour === 0) ? 23 : currentHour - 1;

  const pastHourAverages = await readingsService.calculatePastHourAverages(date, pastHour);

  for (let i = 0; i < pastHourAverages.length; i += 1)
    await readingsService.createAverage(pastHourAverages[i], date, currentHour);

  await readingsService.deletePastHourReadings(date, pastHour);
};

// here --

const getNodeReadings = async (req, res) => {
  const { nodeData, date } = req.params;

  // Get week dates
  const currentDate = new Date(date);
  const sundayDate = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
  const weekDates = [new Date(sundayDate)];

  while (sundayDate.setDate(sundayDate.getDate() + 1) && sundayDate.getDay() !== 0) {
    weekDates.push(new Date(sundayDate));
  }

  // Get date variables
  const dateVariables = await readingsService.getDateVariables(
    nodeData.node_id,
    nodeData.location_id,
    date,
  );

  // Get day readings
  const dayReadings = [];

  for (let i = 0; i < dateVariables.length; i += 1) {
    const dayAverages = await readingsService.getDateReadings(
      nodeData.node_id,
      nodeData.location_id,
      dateVariables[i].variable_id,
      date.toISOString().split('T')[0],
    );

    const weekData = [];

    for (let j = 0; j < weekDates.length; j += 1) {
      const dayRange = await readingsService.getDateRange(
        nodeData.node_id,
        nodeData.location_id,
        dateVariables[i].variable_id,
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
      variable_id: dateVariables[i].variable_id,
      variable_name: dateVariables[i].name,
      unit: dateVariables[i].unit,
      color: dateVariables[i].color,
      dayAverages,
      weekData,
    });
  }

  return res.status(200).send(dayReadings);
};

module.exports = {
  create,
  calculateAverages,
  getNodeReadings,
};
