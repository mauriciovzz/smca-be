const locationsService = require('../services/locations');
const CustomError = require('../utils/CustomError');

const checkLocationId = async (req, res, next) => {
  const { spaceId } = req;
  const { locationId } = req.params;

  const locationData = await locationsService.find(locationId, spaceId);

  if (!locationData)
    return next(new CustomError('La ubicación indicada no se encuentra registrada.', 404));

  req.locationData = locationData;
  return next();
};

module.exports = checkLocationId;
