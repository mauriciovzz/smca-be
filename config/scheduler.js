const schedule = require('node-schedule');
const readingsController = require('../controllers/readings');
const logger = require('../utils/logger');

const dateFormat = new Intl.DateTimeFormat(
  'es-VE',
  {
    timeZone: 'America/Caracas',

    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  },
);

const hourFormt = new Intl.DateTimeFormat(
  'es-VE',
  {
    timeZone: 'America/Caracas',
    hourCycle: 'h23',

    hour: '2-digit',
  },
);

schedule.scheduleJob('00 * * * *', async () => {
  let currentDate = new Date();

  const hour = hourFormt.format(currentDate);

  currentDate = (hour !== '00')
    ? dateFormat.format(currentDate)
    : dateFormat.format(currentDate.setDate(currentDate.getDate() - 1));

  // Calculate hourly averages
  await readingsController.calculateAverages(currentDate, hour);

  // Calculate hourly AQIs
  await readingsController.calculateAQIs(currentDate, hour);

  logger.divider();
});
