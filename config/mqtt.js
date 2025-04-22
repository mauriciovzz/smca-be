const mqtt = require('mqtt');
const config = require('./config');
const readingsController = require('../controllers/readings');
const photosController = require('../controllers/photos');

const options = {
  host: config.MQTT_HOST,
  port: config.MQTT_PORT,
  protocol: config.MQTT_PROTOCOL,
  username: config.MQTT_USERNAME,
  password: config.MQTT_PASSWORD,
};

const client = mqtt.connect(options);

client.subscribe(config.MQTT_READING_TOPIC);
client.subscribe(config.MQTT_PHOTO_TOPIC);

client.on('message', async (topic, message) => {
  if (topic === config.MQTT_READING_TOPIC) {
    await readingsController.create(JSON.parse(message));
  }

  if (topic === config.MQTT_PHOTO_TOPIC) {
    await photosController.create(message);
  }
});
