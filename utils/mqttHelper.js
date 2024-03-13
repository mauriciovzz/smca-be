const mqtt = require('mqtt');
const config = require('./config');
const readingsController = require('../controllers/readings');
const photosController = require('../controllers/to fix/photos');

const options = {
  host: config.MQTT_HOST,
  port: config.MQTT_PORT,
  protocol: config.MQTT_PROTOCOL,
  username: config.MQTT_USERNAME,
  password: config.MQTT_PASSWORD,
};

const client = mqtt.connect(options);

client.subscribe('/readings');
client.subscribe('/photos');

client.on('message', async (topic, message) => {
  if (topic === '/readings') {
    await readingsController.create(JSON.parse(message));
  }
  if (topic === '/photos') {
    await photosController.create(message);
  }
});

const end = async () => client.end();

module.exports = {
  end,
};
