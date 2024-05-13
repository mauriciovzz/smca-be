const fs = require('fs');
const pool = require('../utils/databaseHelper');
const logger = require('../utils/logger');
const nodesService = require('../services/nodes');

const create = async (photo) => {
  // try {
  //   const info = photo.subarray(0, photo.indexOf(255)).toString('ascii').split(',');

  //   const nodeCode = info[0];
  //   const photoDate = info[2];
  //   const photoTime = info[3];

  //   const foundNode = await nodesService.getOneWithNodeCode(nodeCode);

  //   if (foundNode) {
  //   }
  //   // Create image
  //   const image = photo.subarray(photo.indexOf(255), photo.length);

  //   const decodedImage = Buffer.from(photo, 'base64');

  //   const photoPath = `images/${nodeId}_${photoDate.replaceAll('/', '-')}_${photoTime}.jpg`;
  //  const photoPath = `images/photo_${noew}.jpg`;

  //   fs.writeFile(photoPath, decodedImage, (err) => {
  //     if (err) throw err;
  //   });

  //   // const sql = ` SELECT lat, long 
  //   //               FROM node
  //   //               WHERE node_type = $1
  //   //               AND   node_id   = $2`;

  //   // const values = [nodeType, nodeId];
  //   // const response = await pool.query(sql, values);

  //   // const sql2 = ` INSERT INTO photo (
  //   //                 node_type, 
  //   //                 node_id, 
  //   //                 lat,  
  //   //                 long,
  //   //                 photo_date,
  //   //                 photo_time, 
  //   //                 photo_path
  //   //               )
  //   //               VALUES ($1, $2, $3, $4, $5, $6, $7)
  //   //               RETURNING *`;
  //   // const {
  //   //   lat,
  //   //   long,
  //   // } = response.rows[0];

  //   // const values2 = [nodeType, nodeId, lat, long, photoDate, photoTime, photoPath];
  //   // const response2 = await pool.query(sql2, values2);
  //   // return response2.rows;
  // } catch (error) {
  //   logger.error(`photos: ${error.message}`);
  //   return null;
  // }
};

/* Get a photo path */
const getDayPaths = async (req, res) => {
  const {
    nodeType, nodeId, lat, long, photoDate,
  } = req.params;

  const sql = ` SELECT photo_path
                FROM photo
                WHERE node_type  = $1
                  AND node_id    = $2
                  AND lat        = $3
                  AND long       = $4
                  AND photo_date = $5`;

  const values = [nodeType, nodeId, lat, long, photoDate];
  const response = await pool.query(sql, values);
  res.send(response.rows);
};

module.exports = {
  create,
  getDayPaths,
};
