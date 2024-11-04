const accountsService = require('../services/accounts');
const CustomError = require('../utils/CustomError');

const checkAccountId = async (req, res, next) => {
  const { accountId } = req;
  const accountIdParam = req.params.accountId;

  const accountData = await accountsService.findById(accountId);

  if (!accountData)
    return next(new CustomError('La cuenta indicada no se encuentra registrada.', 404));

  if (accountData.account_id !== parseInt(accountIdParam, 10))
    return next(new CustomError('Acceso no autorizado.', 401));

  req.accountData = accountData;
  return next();
};

module.exports = checkAccountId;
