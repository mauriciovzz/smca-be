/* eslint no-console: 0 */
const fs = require('fs');

const divider = () => {
  console.log('--------------------------------------------------------------------------------');
};

const info = (...params) => {
  console.log(...params);
};

const logReading = (nodeId, locationId, variableId, readingDate, readingTime, readingValue) => {
  const logStream = fs.createWriteStream(`node-${nodeId}-readings-log.txt`, { flags: 'a' });

  logStream.write(`${nodeId},${locationId},${variableId},${readingDate},${readingTime},${readingValue}\n`);
  logStream.end();
};

const logPhoto = (nodeId, locationId, photoDate, photoTime, photoHour, photoPath) => {
  const logStream = fs.createWriteStream(`node-${nodeId}-photos-log.txt`, { flags: 'a' });

  logStream.write(`${nodeId},${locationId},${photoDate},${photoTime},${photoHour},${photoPath}\n`);
  logStream.end();
};

const error = (err) => {
  console.error('ERROR', err.statusCode);
  console.error('Message:', err.message);
  console.error('Stack trace:', err.stack);
  divider();
};

module.exports = {
  divider,
  info,
  logReading,
  logPhoto,
  error,
};
