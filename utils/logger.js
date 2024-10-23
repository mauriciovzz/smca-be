/* eslint no-console: 0 */

const divider = () => {
  console.log('--------------------------------------------------------------------------------');
};

const info = (...params) => {
  console.log(...params);
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
  error,
};
