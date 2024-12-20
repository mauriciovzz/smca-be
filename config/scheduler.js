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

schedule.scheduleJob('00 * * * *', (fireDate) => {
  const currentHour = hourFormt.format(fireDate);

  const date = (currentHour !== '00')
    ? dateFormat.format(fireDate)
    : dateFormat.format(fireDate.setDate(fireDate.getDate() - 1));

  logger.info(`calculating averages - ${date} - ${currentHour}:00`);
  readingsController.calculateAverages(date, currentHour);
  logger.divider();
});
