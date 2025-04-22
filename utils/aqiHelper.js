const readingsService = require('../services/readings');

const aqiMappings = {
  O3_8h: [
    {
      breakPoints: { lowerBreakPoint: 0.000, higherBreakPoint: 0.054 },
      indexes: { lowerIndex: 0, higherIndex: 50 },
    },
    {
      breakPoints: { lowerBreakPoint: 0.055, higherBreakPoint: 0.070 },
      indexes: { lowerIndex: 51, higherIndex: 100 },
    },
    {
      breakPoints: { lowerBreakPoint: 0.071, higherBreakPoint: 0.085 },
      indexes: { lowerIndex: 101, higherIndex: 150 },
    },
    {
      breakPoints: { lowerBreakPoint: 0.086, higherBreakPoint: 0.105 },
      indexes: { lowerIndex: 151, higherIndex: 200 },
    },
    {
      breakPoints: { lowerBreakPoint: 0.106, higherBreakPoint: 0.200 },
      indexes: { lowerIndex: 201, higherIndex: 300 },
    },
    {
      breakPoints: { lowerBreakPoint: 0.201, higherBreakPoint: 0.604 },
      indexes: { lowerIndex: 301, higherIndex: 500 },
    },
  ],
  O3_1h: [
    {
      breakPoints: { lowerBreakPoint: 0.125, higherBreakPoint: 0.164 },
      indexes: { lowerIndex: 101, higherIndex: 150 },
    },
    {
      breakPoints: { lowerBreakPoint: 0.165, higherBreakPoint: 0.204 },
      indexes: { lowerIndex: 151, higherIndex: 200 },
    },
    {
      breakPoints: { lowerBreakPoint: 0.205, higherBreakPoint: 0.404 },
      indexes: { lowerIndex: 201, higherIndex: 300 },
    },
    {
      breakPoints: { lowerBreakPoint: 0.405, higherBreakPoint: 0.604 },
      indexes: { lowerIndex: 301, higherIndex: 500 },
    },
  ],
  'PM2.5_24h': [
    {
      breakPoints: { lowerBreakPoint: 0.0, higherBreakPoint: 9.0 },
      indexes: { lowerIndex: 0, higherIndex: 50 },
    },
    {
      breakPoints: { lowerBreakPoint: 9.1, higherBreakPoint: 35.4 },
      indexes: { lowerIndex: 51, higherIndex: 100 },
    },
    {
      breakPoints: { lowerBreakPoint: 35.5, higherBreakPoint: 55.4 },
      indexes: { lowerIndex: 101, higherIndex: 150 },
    },
    {
      breakPoints: { lowerBreakPoint: 55.5, higherBreakPoint: 125.4 },
      indexes: { lowerIndex: 151, higherIndex: 200 },
    },
    {
      breakPoints: { lowerBreakPoint: 125.5, higherBreakPoint: 225.4 },
      indexes: { lowerIndex: 201, higherIndex: 300 },
    },
    {
      breakPoints: { lowerBreakPoint: 225.5, higherBreakPoint: 325.4 },
      indexes: { lowerIndex: 301, higherIndex: 400 },
    },
  ],
  PM10_24h: [
    {
      breakPoints: { lowerBreakPoint: 0, higherBreakPoint: 54 },
      indexes: { lowerIndex: 0, higherIndex: 50 },
    },
    {
      breakPoints: { lowerBreakPoint: 55, higherBreakPoint: 154 },
      indexes: { lowerIndex: 51, higherIndex: 100 },
    },
    {
      breakPoints: { lowerBreakPoint: 155, higherBreakPoint: 254 },
      indexes: { lowerIndex: 101, higherIndex: 150 },
    },
    {
      breakPoints: { lowerBreakPoint: 255, higherBreakPoint: 354 },
      indexes: { lowerIndex: 151, higherIndex: 200 },
    },
    {
      breakPoints: { lowerBreakPoint: 355, higherBreakPoint: 424 },
      indexes: { lowerIndex: 201, higherIndex: 300 },
    },
    {
      breakPoints: { lowerBreakPoint: 425, higherBreakPoint: 604 },
      indexes: { lowerIndex: 301, higherIndex: 500 },
    },
  ],
  CO_8h: [
    {
      breakPoints: { lowerBreakPoint: 0.0, higherBreakPoint: 4.4 },
      indexes: { lowerIndex: 0, higherIndex: 50 },
    },
    {
      breakPoints: { lowerBreakPoint: 4.5, higherBreakPoint: 9.4 },
      indexes: { lowerIndex: 51, higherIndex: 100 },
    },
    {
      breakPoints: { lowerBreakPoint: 9.5, higherBreakPoint: 12.4 },
      indexes: { lowerIndex: 101, higherIndex: 150 },
    },
    {
      breakPoints: { lowerBreakPoint: 12.5, higherBreakPoint: 15.4 },
      indexes: { lowerIndex: 151, higherIndex: 200 },
    },
    {
      breakPoints: { lowerBreakPoint: 15.5, higherBreakPoint: 30.4 },
      indexes: { lowerIndex: 201, higherIndex: 300 },
    },
    {
      breakPoints: { lowerBreakPoint: 30.5, higherBreakPoint: 50.4 },
      indexes: { lowerIndex: 301, higherIndex: 500 },
    },
  ],
  SO2_1h: [
    {
      breakPoints: { lowerBreakPoint: 0, higherBreakPoint: 35 },
      indexes: { lowerIndex: 0, higherIndex: 50 },
    },
    {
      breakPoints: { lowerBreakPoint: 36, higherBreakPoint: 75 },
      indexes: { lowerIndex: 51, higherIndex: 100 },
    },
    {
      breakPoints: { lowerBreakPoint: 76, higherBreakPoint: 185 },
      indexes: { lowerIndex: 101, higherIndex: 150 },
    },
    {
      breakPoints: { lowerBreakPoint: 186, higherBreakPoint: 304 },
      indexes: { lowerIndex: 151, higherIndex: 200 },
    },
    {
      breakPoints: { lowerBreakPoint: 305, higherBreakPoint: 604 },
      indexes: { lowerIndex: 201, higherIndex: 300 },
    },
    {
      breakPoints: { lowerBreakPoint: 605, higherBreakPoint: 1004 },
      indexes: { lowerIndex: 301, higherIndex: 500 },
    },
  ],
  NO2_1h: [
    {
      breakPoints: { lowerBreakPoint: 0, higherBreakPoint: 53 },
      indexes: { lowerIndex: 0, higherIndex: 50 },
    },
    {
      breakPoints: { lowerBreakPoint: 54, higherBreakPoint: 100 },
      indexes: { lowerIndex: 51, higherIndex: 100 },
    },
    {
      breakPoints: { lowerBreakPoint: 101, higherBreakPoint: 360 },
      indexes: { lowerIndex: 101, higherIndex: 150 },
    },
    {
      breakPoints: { lowerBreakPoint: 361, higherBreakPoint: 649 },
      indexes: { lowerIndex: 151, higherIndex: 200 },
    },
    {
      breakPoints: { lowerBreakPoint: 650, higherBreakPoint: 1249 },
      indexes: { lowerIndex: 201, higherIndex: 300 },
    },
    {
      breakPoints: { lowerBreakPoint: 1250, higherBreakPoint: 2049 },
      indexes: { lowerIndex: 301, higherIndex: 500 },
    },
  ],
};

const getTimeRange = (currentDate, currentHour, numItems) => {
  const date = new Date(currentDate.split('/').reverse().join('-'));
  let hour = currentHour - 1;

  const end = {
    date: date.toISOString().split('T')[0],
    hour: currentHour,
  };

  for (let i = 1; i < numItems; i += 1) {
    hour -= 1;
    if (hour < 0) {
      date.setDate(date.getDate() - 1);
      hour = 23;
    }
  }

  const start = {
    date: date.toISOString().split('T')[0],
    hour: hour + 1,
  };

  return { start, end };
};

const truncateFloat = (value, decimals) => {
  const factor = 10 ** decimals;
  return Math.trunc(value * factor) / factor;
};

const aqiCalculation = (pollutant, concentration) => {
  const ranges = aqiMappings[pollutant];

  const range = ranges.find(({ breakPoints }) => (
    concentration >= breakPoints.lowerBreakPoint
    && concentration <= breakPoints.higherBreakPoint
  ));

  const { breakPoints, indexes } = range;

  // AQI Formula
  const aqi = (
    ((indexes.higherIndex - indexes.lowerIndex)
      / (breakPoints.higherBreakPoint - breakPoints.lowerBreakPoint))
    * (concentration - breakPoints.lowerBreakPoint)
  ) + indexes.lowerIndex;

  return Math.round(aqi);
};

const rowsPM = 24;

const calculateAqiForPm25 = async (date, hour, locationId, variableId) => {
  const { start, end } = getTimeRange(date, hour, rowsPM);

  const averageResponse = await readingsService.calculateAverageForAQI(
    locationId,
    variableId,
    start,
    end,
  );

  let aqi = null;

  if (averageResponse.rows_count === rowsPM.toString()) {
    aqi = aqiCalculation(
      'PM2.5_24h',
      truncateFloat(averageResponse.average, 1),
    );
  }

  return aqi;
};

const calculateAqiForPm10 = async (date, hour, locationId, variableId) => {
  const { start, end } = getTimeRange(date, hour, rowsPM);

  const averageResponse = await readingsService.calculateAverageForAQI(
    locationId,
    variableId,
    start,
    end,
  );

  let aqi = null;

  if (averageResponse.rows_count === rowsPM.toString()) {
    aqi = aqiCalculation(
      'PM10_24h',
      Math.round(averageResponse.average),
    );
  }

  return aqi;
};

const calculateAqi = async (date, hour, locationId, variableName, variableId) => {
  switch (variableName) {
    case 'pm2.5':
      return calculateAqiForPm25(date, hour, locationId, variableId);
    case 'pm10':
      return calculateAqiForPm10(date, hour, locationId, variableId);
    // case 'o3':
    //   return calculateAqiForO3(date, hour, locationId, variableId);
    // case 'no2':
    //   return calculateAqiForNo2(date, hour, locationId, variableId);
    // case 'so2':
    //   return calculateAqiForSo2(date, hour, locationId, variableId);
    // case 'co':
    //   return calculateAqiForCo(date, hour, locationId, variableId);
    default:
      return null;
  }
};

module.exports = {
  calculateAqi,
};
