const app = require('./app');
const client = require('./utils/mqttHelper');
const pool = require('./utils/databaseHelper');
const schedule = require('./utils/averageReadingsScheduler');
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
  logger.info('---');
});

function handle(signal) {
  logger.info(`\nReceived ${signal}`);
  server.close(() => {
    logger.info('Http server closed.');
    client.end().then(() => {
      logger.info('Mqtt connection closed.');
      schedule.end().then(() => {
        logger.info('Schedule shutdown.');
        pool.end().then(() => {
          logger.info('PostgreSQL connection closed.');
          process.exit(0);
        });
      });
    });
  });
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
