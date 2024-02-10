const { Pool } = require('pg');
const config = require('./config');
const logger = require('./logger');

const pool = new Pool({
  connectionString: config.DB_URL,
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

const end = async () => pool.end();

module.exports = {
  query,
  end,
};
