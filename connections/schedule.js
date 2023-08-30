const schedule = require('node-schedule');
const averageReadingsController = require('../controllers/average_readings');

schedule.scheduleJob('00 * * * *', (fireDate) => {
  averageReadingsController.calculateAverageReadings(fireDate);
});

const end = () => schedule.gracefulShutdown();

module.exports = {
  end,
};
