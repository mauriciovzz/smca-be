const fs = require('fs');
const logger = require('../utils/logger');
const nodesService = require('../services/nodes');
const photosService = require('../services/photos');

const create = async (newPhoto) => {
  try {
    const photoInfo = newPhoto.subarray(0, newPhoto.indexOf(255)).toString('ascii').split(',');

    const nodeCode = photoInfo[0];
    const componentId = photoInfo[1];
    const photoDate = photoInfo[2];
    const readingTime = photoInfo[3];

    if (nodeCode && componentId && photoDate && readingTime) {
      const foundNode = await nodesService.checkNodeCamera(nodeCode, componentId);

      if (foundNode) {
        const photoPath = `images/${foundNode.node_id}_${componentId}_${foundNode.location_id}_${photoDate.replaceAll('/', '-')}_${parseInt(readingTime.slice(0, 2), 10) + 1}.jpg`;
        await photosService.createReference(
          foundNode.node_id,
          foundNode.location_id,
          componentId,
          photoDate,
          parseInt(readingTime.slice(0, 2), 10) + 1,
          `/api/${photoPath}`,
        );

        const photoData = newPhoto.subarray(newPhoto.indexOf(255), newPhoto.length);
        const decodedPhoto = Buffer.from(photoData, 'base64');
        fs.writeFile(photoPath, decodedPhoto, (err) => {
          if (err) throw err;
        });

        logger.info('new image: ', photoPath);
      }
    }
  } catch (error) {
    logger.error(`photos: ${error}`);
  }
};

const getNodePhotos = async (req, res) => {
  const { nodeId, locationId, date } = req.params;
  const dayPhotos = await photosService.getDayReferences(nodeId, locationId, date);

  return res.status(200).send(dayPhotos);
};

module.exports = {
  create,
  getNodePhotos,
};
