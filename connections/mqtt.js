const mqtt = require('mqtt');
const config = require('../utils/config');
const readingsHelper = require('../utils/readingQuerys');

const options = {
  host: config.MQTT_HOST,
  port: config.MQTT_PORT,
  protocol: config.MQTT_PROTOCOL,
  username: config.MQTT_USERNAME,
  password: config.MQTT_PASSWORD,
};

const client = mqtt.connect(options);

client.subscribe('/node_readings');

client.on('message', (topic, message) => {
  readingsHelper.insertReading(JSON.parse(message));
});

const end = async () => client.end();

module.exports = {
  end,
};
