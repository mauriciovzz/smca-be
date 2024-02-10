const pool = require('../utils/databaseHelper');

const deleteAllRows = async (table) => {
  await pool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
};

const getAllRows = async (table) => {
  const response = await pool.query(`SELECT * FROM ${table}`);
  return response.rows;
};

module.exports = {
  deleteAllRows,
  getAllRows,
};
