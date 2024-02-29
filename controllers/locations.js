const locationsService = require('../services/locations');

const getAll = async (req, res) => {
  const { workspaceId } = req.params;

  const response = await locationsService.getAll(workspaceId);
  return res.status(200).send(response);
};

const create = async (req, res) => {
  const { workspaceId } = req.params;
  const {
    name, location, lat, long,
  } = req.body;

  if (await locationsService.checkCoordinates(workspaceId, lat, long)) {
    return res.status(409).json({ error: 'Las coordenadas ingresadas ya se encuentran registradas.' });
  }

  if (await locationsService.checkColumn(workspaceId, 'name', name.toLowerCase())) {
    return res.status(409).json({ error: 'El nombre de ubicacion ingresado ya se encuentra registrado.' });
  }

  if (await locationsService.checkColumn(workspaceId, 'location', location.toLowerCase())) {
    return res.status(409).json({ error: 'La ubicacion ingresada ya se encuentra registrada.' });
  }

  await locationsService.create(
    workspaceId,
    name.toLowerCase(),
    location.toLowerCase(),
    lat,
    long,
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

// const getFree = async (req, res) => {
//   const sql = ` SELECT
//                   *
//                 FROM
//                   location
//                 WHERE
//                   taken=false`;

//   const result = await pool.query(sql);
//   res.send(result.rows);
// };

// const getOne = async (req, res) => {
//   const { lat, long } = req.params;

//   const sql = ` SELECT
//                   *
//                 FROM
//                   location
//                 WHERE
//                   lat      = $1
//                   AND long = $2`;

//   const response = await pool.query(sql, [lat, long]);
//   res.send(response.rows);
// };

module.exports = {
  getAll,
  create,
  update,
  remove,
};
