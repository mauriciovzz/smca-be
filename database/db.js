const { Pool } = require('pg');
const config = require('../utils/config');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: config.DB_LOCAL_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;

  logger.info('executed query', { text, duration, rows: res.rowCount });
  logger.info('---');

  return res;
};

module.exports = {
  query,
};
