const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const nodesService = require('../services/nodes');
const photosService = require('../services/photos');

const CustomError = require('../utils/CustomError');

const validatePhotoData = (nodeCode, componentId, photoDate, photoTime) => {
  // 4 byte HEX
  const regexNodeCode = /^[0-9a-fA-F]{8}$/;

  // valid ID
  const isId = Number.isInteger(Number(componentId));

  // YYYY-MM-DD
  const regexDate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  // HH:MM:SS (24h)
  const regexTime = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

  return (
    regexNodeCode.test(nodeCode)
    && isId
    && regexDate.test(photoDate)
    && regexTime.test(photoTime)
  );
};

const convertDateFormat = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

const convertHourFormat = (timeStr) => {
  const [hour] = timeStr.split(':');
  const nextHour = (parseInt(hour, 10) % 24) + 1;
  return String(nextHour).padStart(2, '0');
};

const create = async (newPhoto) => {
  try {
    const photoInfo = newPhoto.subarray(0, newPhoto.indexOf(255)).toString('ascii').split(',');

    const nodeCode = photoInfo[0];
    const componentId = photoInfo[1];
    const photoDate = photoInfo[2];
    const photoTime = photoInfo[3];

    if (validatePhotoData(nodeCode, componentId, photoDate, photoTime)) {
      const node = await nodesService.checkNodeAndCamera(nodeCode, componentId);

      const dateFormated = convertDateFormat(photoDate);
      const hourFormated = convertHourFormat(photoTime);

      if (node.node_id) {
        const alreadyTaken = await photosService.checkForPhoto(
          node.location_id,
          dateFormated,
          hourFormated,
        );

        if (!alreadyTaken) {
          const rootDir = process.cwd();
          const baseDir = path.join(rootDir, 'photos');
          const locDir = path.join(baseDir, `location_${node.location_id}`);
          const dateDir = path.join(locDir, dateFormated);

          if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
          if (!fs.existsSync(locDir)) fs.mkdirSync(locDir);
          if (!fs.existsSync(dateDir)) fs.mkdirSync(dateDir);

          const photoName = `${node.node_id}_${node.location_id}_${dateFormated}_${hourFormated}.jpg`;
          const photoPath = path.join(dateDir, photoName);

          const photoData = newPhoto.subarray(newPhoto.indexOf(255), newPhoto.length);
          const decodedPhoto = Buffer.from(photoData, 'base64');

          fs.writeFile(photoPath, decodedPhoto, async (err) => {
            if (err) {
              logger.error(err);
            } else {
              const marker = '/smca-be';
              const index = photoPath.indexOf(marker);
              const newPath = photoPath.substring(index + marker.length);

              await photosService.create(
                node.node_id,
                node.location_id,
                dateFormated,
                hourFormated,
                newPath,
              );

              logger.logPhoto(
                node.node_id,
                node.location_id,
                dateFormated,
                photoTime,
                hourFormated,
                newPath,
              );
            }
          });
        }
      }
    }
  } catch (error) {
    logger.error(error);
  }
};

const getPhoto = async (req, res) => {
  const { nodeId, locationId, date, hour } = req.params;

  const photo = await photosService.getPhotoPath(
    nodeId,
    locationId,
    date,
    hour,
  );

  if (photo[0]?.photo_path) {
    const rootDir = process.cwd();
    const safePath = path.join(rootDir, photo[0].photo_path);

    return res.status(200).sendFile(safePath);
  }

  throw new CustomError('No se ha encontrado la imagen solicitada.', 404);
};

const checkDateForPhotos = async (req, res) => {
  const { nodeId, locationId, date } = req.params;

  const hasPhotos = await photosService.checkDateForPhotos(
    nodeId,
    locationId,
    date,
  );

  res.status(200).json(hasPhotos);
};

module.exports = {
  create,
  checkDateForPhotos,
  getPhoto,
};
