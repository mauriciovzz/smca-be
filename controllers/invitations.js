const invitationsService = require('../services/invitations');
const accountsService = require('../services/accounts');
const spacesService = require('../services/spaces');
const membersService = require('../services/members');
const CustomError = require('../utils/CustomError');

const invite = async (req, res, next) => {
  const { accountId, spaceId } = req;
  const { email } = req.body;

  const accountData = await accountsService.findByEmail(email.toLowerCase());

  if (!accountData)
    return next(new CustomError('EmailNotFound', 404));

  if (!accountData.is_verified)
    return next(new CustomError('La cuenta ingresada no se encuentra verificada.', 409));

  if (await spacesService.isMember(spaceId, accountData.account_id))
    return next(new CustomError('La cuenta ya forma parte del espacio.', 409));

  if (await invitationsService.find(spaceId, accountData.account_id))
    return next(new CustomError('Ya se le envio una invitación a la cuenta indicada.', 409));

  await invitationsService.create(
    spaceId,
    accountData.account_id,
    accountId,
  );

  return res.status(201).send('Invitación enviada exitosamente.');
};

const getInvitations = async (req, res) => {
  const { accountId } = req;

  const invitations = await invitationsService.getAll(
    accountId,
  );

  return res.status(200).send(invitations);
};

const invitationResponse = async (req, res) => {
  const { spaceId, accountId } = req;
  const { wasAccepted } = req.body;

  if (wasAccepted) {
    await membersService.addMember(
      spaceId,
      accountId,
      false,
    );
  }

  await invitationsService.remove(
    spaceId,
    accountId,
  );

  return res.status(201).send(wasAccepted ? 'Invitación aceptada.' : 'Invitación rechazada.');
};

module.exports = {
  invite,
  getInvitations,
  invitationResponse,
};
