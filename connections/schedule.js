const schedule = require('node-schedule');

const readingsHelper = require('../utils/readingQuerys');

schedule.scheduleJob('0/1 * * * *', (fireDate) => {
  readingsHelper.calculateAverageReadings(fireDate);
});

const end = () => schedule.gracefulShutdown();

module.exports = {
  end,
};
