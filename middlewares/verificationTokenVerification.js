const accountsService = require('../services/accounts');
const verificationTokensService = require('../services/verificationTokens');
const CustomError = require('../utils/CustomError');

const verificationTokenVerification = (tokenType) => (
  async (req, res, next) => {
    const { accountId, verificationToken } = req.params;

    if (!await accountsService.findById(accountId))
      return next(new CustomError('Link inválido.', 404));

    const tokenData = await verificationTokensService.find(
      tokenType,
      verificationToken,
    );

    if (!tokenData)
      return next(new CustomError('Link inválido.', 404));

    if (Date.now() / 1000 > Date.parse(tokenData.expiration) / 1000) {
      await verificationTokensService.remove(tokenData.account_id, tokenType);
      return next(new CustomError('El link utilizado ha expirado.', 410));
    }

    req.tokenData = tokenData;
    return next();
  }
);

module.exports = verificationTokenVerification;
