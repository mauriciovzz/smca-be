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

const criteriaPollutants = ['pm2.5', 'pm10', 'o3', 'no2', 'so2', 'co'];

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

const formatAverage = (valueType, variableName, averageValue) => {
  if (valueType === 'presential')
    return (averageValue > 0) ? 1 : 0;

  if (['temperatura', 'humedad', 'presión', 'pm10', 'so2', 'no2', 'voc'].includes(variableName))
    return Math.round(averageValue);

  if (['radiación solar'].includes(variableName))
    return Math.round(averageValue * 100) / 100;

  if (['o3'].includes(variableName))
    return Math.round(variableName * 1000) / 1000;

  if (['pm2.5', 'co'].includes(variableName))
    return Math.round(averageValue * 10) / 10;

  return averageValue;
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

// Endpoint functions

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
    await readingsService.createAverage(
      pastHourAverages[i].nodeid,
      pastHourAverages[i].locationid,
      pastHourAverages[i].variableid,
      formatAverage(
        pastHourAverages[i].valuetype,
        pastHourAverages[i].variablename,
        pastHourAverages[i].averagevalue,
      ),
      currentDate,
      currentHour,
    );

  await readingsService.deletePastHourReadings(currentDate, pastHour);
};

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
        min: dateReadingsRange.min,
        max: dateReadingsRange.max,
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

const sortOrder = [
  'temperatura',
  'humedad',
  'presión',
  'precipitación',
  'radiación solar',
  'pm2.5',
  'pm10',
  'o3',
  'no2',
  'so2',
  'co',
];

const getLocationsWithReadings = async (req, res) => {
  const { accountId } = req;

  const locations = await readingsService.getLocationsWithReadings(accountId);

  for (let i = 0; i < locations.length; i += 1) {
    const earliestDate = await readingsService.getLocationEarliestReadingDate(
      locations[i].location_id,
    );
    locations[i].earliest_reading_date = earliestDate;

    const variablesRead = await readingsService.getLocationReadVariables(
      locations[i].location_id,
    );

    locations[i].variables_read = variablesRead.sort((a, b) => {
      const indexA = sortOrder.indexOf(a.variable_name);
      const indexB = sortOrder.indexOf(b.variable_name);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      if (indexA !== -1) return -1;

      if (indexB !== -1) return 1;

      return a.variable_name.localeCompare(b.variable_name);
    });
  }

  return res.status(200).send(locations);
};

const getSpaceLocationsWithReadings = async (req, res) => {
  const { spaceId } = req;

  const locations = await readingsService.getSpaceLocationsWithReadings(spaceId);

  for (let i = 0; i < locations.length; i += 1) {
    const earliestDate = await readingsService.getLocationEarliestReadingDate(
      locations[i].location_id,
    );
    locations[i].earliest_reading_date = earliestDate;

    const variablesRead = await readingsService.getLocationReadVariables(
      locations[i].location_id,
    );

    locations[i].variables_read = variablesRead.sort((a, b) => {
      const indexA = sortOrder.indexOf(a.variable_name);
      const indexB = sortOrder.indexOf(b.variable_name);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      if (indexA !== -1) return -1;

      if (indexB !== -1) return 1;

      return a.variable_name.localeCompare(b.variable_name);
    });
  }

  return res.status(200).send(locations);
};

const generateReport = async (req, res) => {
  const { locationId, dateRange, selectedVariables } = req.body;

  const formatReadings = (readings) => {
    const readingsArray = [];

    for (let i = 1; i < 25; i += 1) {
      const currentValue = readings.find((r) => r.average_hour === i);

      readingsArray.push((currentValue === undefined) ? null : currentValue.average_value);
    }

    return readingsArray;
  };

  const formatDateInVenezuela = (date) => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Caracas',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

  const response = [];

  const currentDate = new Date(dateRange[0]);
  const endDate = new Date(dateRange[1]);

  const variablesRead = await readingsService.getLocationReadVariables(
    locationId,
  );

  const variablesRequested = variablesRead.filter((v) => selectedVariables.includes(v.variable_id));

  variablesRequested.sort((a, b) => {
    const indexA = sortOrder.indexOf(a.variable_name);
    const indexB = sortOrder.indexOf(b.variable_name);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) return -1;

    if (indexB !== -1) return 1;

    return a.variable_name.localeCompare(b.variable_name);
  });

  variablesRequested.forEach((v) => {
    v.data = [];
    response.push(v);
  });

  while (endDate >= currentDate) {
    const currentVenDate = formatDateInVenezuela(currentDate);

    for (let i = 0; i < variablesRequested.length; i += 1) {
      const dateReadings = await readingsService.getDateReadingsByVariable(
        locationId,
        variablesRequested[i].variable_id,
        currentVenDate,
      );

      const formatedReadings = formatReadings(dateReadings);

      variablesRequested[i].data.push({
        date: currentVenDate,
        readings: formatedReadings,
      });
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return res.status(200).send(response);
};

module.exports = {
  create,
  calculateAverages,
  calculateAQIs,
  getDateReadings,
  getLocationsWithReadings,
  getSpaceLocationsWithReadings,
  generateReport,
};
