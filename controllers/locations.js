const locationsService = require('../services/locations');
const CustomError = require('../utils/CustomError');

const create = async (req, res, next) => {
  const { spaceId } = req;
  const {
    lat, long, name, location,
  } = req.body;

  if (await locationsService.areCoordinatesTaken(lat, long))
    return next(new CustomError('Las coordenadas ingresadas ya se encuentran registradas.', 409));

  await locationsService.create(
    spaceId,
    lat,
    long,
    name.toLowerCase(),
    location.toLowerCase(),
  );

  return res.status(201).send('Ubicación creada exitosamente.');
};

const getAll = async (req, res) => {
  const { spaceId } = req;

  const response = await locationsService.getAll(
    spaceId,
  );

  return res.status(200).send(response);
};

const update = async (req, res) => {
  const { locationData } = req;
  const { name, location, isVisible } = req.body;

  await locationsService.update(
    locationData.location_id,
    name.toLowerCase(),
    location.toLowerCase(),
    isVisible,
  );

  return res.status(201).send('Ubicación actualizada exitosamente.');
};

const updateVisibility = async (req, res) => {
  const { locationData } = req;

  await locationsService.updateIsVisible(
    locationData.location_id,
  );

  return res.status(201).send('Visibilidad actualizada exitosamente.');
};

const removeReadings = async (req, res) => {
  const { locationData } = req;

  return res.status(200).send(`To do: ${locationData.location_id}`);
};

const remove = async (req, res, next) => {
  const { locationData } = req;

  if (locationData.is_taken)
    return next(new CustomError('La ubicación se encuentra en uso.', 401));

  await locationsService.remove(
    locationData.location_id,
  );

  return res.status(200).send('Ubicación eliminada exitosamente.');
};

module.exports = {
  getAll,
  create,
  update,
  updateVisibility,
  removeReadings,
  remove,
};
