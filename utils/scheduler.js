const schedule = require('node-schedule');
const readingsController = require('../controllers/readings');

schedule.scheduleJob('00 * * * *', (fireDate) => {
  readingsController.calculateReadingsAverages(fireDate);
});
