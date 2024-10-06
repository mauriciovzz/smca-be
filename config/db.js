const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  connectionString: config.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const query = async (text, params) => {
  const response = await pool.query(text, params);

  return response;
};

const end = async () => pool.end();

module.exports = {
  query,
  end,
};
