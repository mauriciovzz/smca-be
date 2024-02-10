const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  return passwordHash;
};

const checkPassword = async (password, passwordHash) => {
  const result = await bcrypt.compare(password, passwordHash);
  return result;
};

module.exports = {
  hashPassword,
  checkPassword,
};
