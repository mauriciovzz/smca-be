const readingsService = require('../services/readings');
const nodesService = require('../services/nodes');
const logger = require('../utils/logger');
const aqiHelper = require('../utils/aqiHelper');

const validateReadingData = (nodeCode, readingDate, readingTime, variableId, readingValue) => {
  // 4 byte HEX
  const regexNodeCode = /^[0-9a-fA-F]{8}$/;

  // YYYY-MM-DD
  const regexDate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  // HH:MM:SS (24h)
  const regexTime = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

  // valid ID
  const isId = Number.isInteger(Number(variableId));

  // valid reading, number
  const isReading = !Number.isNaN(Number(readingValue));

  return (
    regexNodeCode.test(nodeCode)
    && regexDate.test(readingDate)
    && regexTime.test(readingTime)
    && isId
    && isReading
  );
};

const create = async (reading) => {
  try {
    const { nodeCode, readingDate, readingTime, variableId, readingValue } = reading;

    if (validateReadingData(nodeCode, readingDate, readingTime, variableId, readingValue)) {
      const node = await nodesService.checkNodeAndVariable(nodeCode, variableId);

      if (node.node_id) {
        await readingsService.create(
          node.node_id,
          node.location_id,
          variableId,
          readingDate,
          readingTime,
          parseFloat(readingValue),
        );

        logger.logReading(
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
    logger.error(err);
  }
};

const calculateAverages = async (currentDate, hour) => {
  const currentHour = (hour === '00')
    ? 24
    : hour;

  const pastHour = (hour === '00')
    ? 23
    : hour - 1;

  logger.info(`calculating averages - ${currentDate} - from: ${pastHour} to ${currentHour}`);

  const pastHourAverages = await readingsService.calculatePastHourAverages(currentDate, pastHour);

  for (let i = 0; i < pastHourAverages.length; i += 1)
    await readingsService.createAverage(pastHourAverages[i], currentDate, currentHour);

  await readingsService.deletePastHourReadings(currentDate, pastHour);
};

const criteriaPollutants = ['pm2.5', 'pm10', 'o3', 'no2', 'so2', 'co'];

const calculateAQIs = async (currentDate, hour) => {
  const currentHour = (hour === '00')
    ? 24
    : hour;

  logger.info(`calculating AQIs - ${currentDate} - ${currentHour}`);

  const activeNodes = await nodesService.getActiveNodes();

  for (let i = 0; i < activeNodes.length; i += 1) {
    const activeNodeVariables = await nodesService.getVariables(activeNodes[i].node_id);

    for (let j = 0; j < activeNodeVariables.length; j += 1) {
      if (criteriaPollutants.includes(activeNodeVariables[j].name)) {
        const aqi = await aqiHelper.calculateAqi(
          currentDate,
          currentHour,
          activeNodes[i].location_id,
          activeNodeVariables[j].name,
          activeNodeVariables[j].variable_id,
        );
        if (aqi !== null) {
          await readingsService.createAqiValue(
            activeNodes[i].node_id,
            activeNodes[i].location_id,
            activeNodeVariables[j].variable_id,
            currentDate,
            currentHour,
            aqi,
          );
        }
      }
    }
  }
};

const convertDateFormat = (dateStr) => {
  const [day, month, year] = dateStr.split('-');
  return `20${year}-${month}-${day}`;
};

const parseArrayData = (array, variableName) => {
  const newArr = [];

  for (let i = 1; i <= 24; i += 1) {
    const match = array.find((reading) => reading.hour === i);

    if (i === 7 || i === 19) {
      newArr.push({
        hour: (i === 7) ? 'sunrise' : 'sunset',
        value: null,
      });
    }

    let newValue = null;

    if (match) {
      if (['temperatura', 'humedad', 'presión'].includes(variableName))
        newValue = Math.round(match.value);
      else if (variableName === 'precipitación')
        newValue = (match.value > 0) ? 1 : 0;
      else
        newValue = match.value;
    }

    newArr.push({
      hour: i,
      value: newValue,
    });
  }

  return newArr;
};

const roundData = (value, variableName) => {
  if (['temperatura', 'humedad', 'presión'].includes(variableName))
    return Math.round(value);

  return value;
};

const getWeekDates = (currentDate) => {
  const [day, month, year] = currentDate.split('-').map(Number);
  const inputDate = new Date(2000 + year, month - 1, day);

  const dayOfWeek = inputDate.getDay();
  const sunday = new Date(inputDate);
  sunday.setDate(inputDate.getDate() - dayOfWeek);

  const weekDates = [];

  for (let i = 0; i < 7; i += 1) {
    const current = new Date(sunday);
    current.setDate(sunday.getDate() + i);
    weekDates.push(current);
  }

  return weekDates;
};

const getDateReadings = async (req, res) => {
  const { nodeId, locationId, date } = req.params;

  // Calculate week dates
  const weekDates = getWeekDates(date);

  // Get date variables
  const dateVariables = await readingsService.getDateVariables(
    nodeId,
    locationId,
    convertDateFormat(date),
  );

  // Get date readings
  const dateReadings = [];

  for (let i = 0; i < dateVariables.length; i += 1) {
    const dateAverages = await readingsService.getDateReadings(
      nodeId,
      locationId,
      dateVariables[i].variable_id,
      convertDateFormat(date),
    );

    const weekData = [];

    for (let j = 0; j < weekDates.length; j += 1) {
      const dateReadingsRange = await readingsService.getDateReadingsRange(
        nodeId,
        locationId,
        dateVariables[i].variable_id,
        weekDates[j].toISOString().split('T')[0],
      );

      weekData.push({
        day: weekDates[j].getDay(),
        weekDay: weekDates[j],
        min: roundData(dateReadingsRange.min, dateVariables[i].name),
        max: roundData(dateReadingsRange.max, dateVariables[i].name),
      });
    }

    if (criteriaPollutants.includes(dateVariables[i].name)) {
      const dateAqis = await readingsService.getDateAQIs(
        nodeId,
        locationId,
        dateVariables[i].variable_id,
        convertDateFormat(date),
      );

      const aqiWeekData = [];

      for (let j = 0; j < weekDates.length; j += 1) {
        const dateAqisRange = await readingsService.getDateAqisRange(
          nodeId,
          locationId,
          dateVariables[i].variable_id,
          weekDates[j].toISOString().split('T')[0],
        );

        aqiWeekData.push({
          day: weekDates[j].getDay(),
          weekDay: weekDates[j],
          min: dateAqisRange.min,
          max: dateAqisRange.max,
        });
      }

      dateReadings.push({
        variable_id: dateVariables[i].variable_id,
        variable_name: dateVariables[i].name,
        variable_type: dateVariables[i].variable_type,
        value_type: dateVariables[i].value_type,
        unit: dateVariables[i].unit,
        color: dateVariables[i].color,
        dateAverages: parseArrayData(dateAverages, dateVariables[i].name),
        weekData,
        dateAqis: parseArrayData(dateAqis, 'aqi'),
        aqiWeekData,
      });
    } else {
      dateReadings.push({
        variable_id: dateVariables[i].variable_id,
        variable_name: dateVariables[i].name,
        variable_type: dateVariables[i].variable_type,
        value_type: dateVariables[i].value_type,
        unit: dateVariables[i].unit,
        color: dateVariables[i].color,
        dateAverages: parseArrayData(dateAverages, dateVariables[i].name),
        weekData,
      });
    }
  }

  return res.status(200).send(dateReadings);
};

module.exports = {
  create,
  calculateAverages,
  calculateAQIs,
  getDateReadings,
};
