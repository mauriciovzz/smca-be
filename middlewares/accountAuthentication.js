const accountsService = require('../services/accounts');
const CustomError = require('../utils/CustomError');

const accountAuthentication = async (req, res, next) => {
  const { accountId } = req.params;

  const accountData = await accountsService.findById(accountId);

  if (!accountData)
    return next(new CustomError('La cuenta indicada no existe.', 404));

  if (accountId !== req.accountId)
    return next(new CustomError('Acceso no autorizado.', 401));

  req.accountData = accountData;
  return next();
};

module.exports = accountAuthentication;
