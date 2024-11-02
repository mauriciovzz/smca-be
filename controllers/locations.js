const locationsService = require('../services/locations');

const getAll = async (req, res) => {
  const { workspaceId } = req.params;

  const response = await locationsService.getAll(workspaceId);
  return res.status(200).send(response);
};

const create = async (req, res) => {
  const { workspaceId } = req.params;
  const {
    lat, long, name, location, isVisible,
  } = req.body;

  if (await locationsService.checkCoordinates(lat, long)) {
    return res.status(409).json({ error: 'Las coordenadas ingresadas ya se encuentran registradas.' });
  }

  if (await locationsService.checkColumn(workspaceId, 'name', name.toLowerCase())) {
    return res.status(409).json({ error: 'El nombre de ubicación ingresado ya se encuentra registrado.' });
  }

  if (await locationsService.checkColumn(workspaceId, 'location', location.toLowerCase())) {
    return res.status(409).json({ error: 'La ubicación ingresada ya se encuentra registrada.' });
  }

  await locationsService.create(
    workspaceId,
    lat,
    long,
    name.toLowerCase(),
    location.toLowerCase(),
    isVisible,
  );
  return res.status(201).send('Ubicación creada exitosamente.');
};

const update = async (req, res) => {
  const { workspaceId, locationId } = req.params;
  const { name, location } = req.body;

  const originalLocation = await locationsService.getOne(workspaceId, locationId);
  if (!(originalLocation.name === name.toLowerCase())) {
    if (await locationsService.checkColumn(workspaceId, 'name', name.toLowerCase())) {
      return res.status(409).json({ error: 'El nombre de ubicación ingresado ya se encuentra registrado.' });
    }
  }

  if (!(originalLocation.location === location.toLowerCase())) {
    if (await locationsService.checkColumn(workspaceId, 'location', location.toLowerCase())) {
      return res.status(409).json({ error: 'La ubicación ingresada ya se encuentra registrada.' });
    }
  }

  await locationsService.update(
    workspaceId,
    locationId,
    name.toLowerCase(),
    location.toLowerCase(),
  );
  return res.status(201).send('Ubicación actualizada exitosamente.');
};

const remove = async (req, res) => {
  const { workspaceId, locationId } = req.params;

  const location = await locationsService.getOne(workspaceId, locationId);
  if (location.is_taken) {
    return res.status(401).json({ error: 'La ubicación se encuentra en uso.' });
  }

  await locationsService.remove(workspaceId, locationId);
  return res.status(200).send('Ubicación eliminada exitosamente.');
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
