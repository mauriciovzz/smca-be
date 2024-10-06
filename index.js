const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');

const client = require('./utils/mqttHelper');
const schedule = require('./utils/scheduler');
const pool = require('./config/db');

const server = app.listen(config.PORT, () => {
  logger.divider();
  logger.info(`Server running on port ${config.PORT}`);
  logger.divider();
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
