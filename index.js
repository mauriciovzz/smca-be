const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');
require('./config/mqtt');
require('./config/scheduler');

app.listen(config.PORT, () => {
  logger.divider();
  logger.info(`Server running on port ${config.PORT}`);
  logger.divider();
});
