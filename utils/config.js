require('dotenv').config();

function selectDB() {
  switch (process.env.NODE_ENV) {
    case 'test':
      return process.env.DB_TEST_URL;
    case 'development':
      return process.env.DB_LOCAL_URL;
    case 'production':
      return process.env.DB_URL;
    default:
      return null;
  }
}

const {
  PORT,
  MQTT_HOST,
  MQTT_PORT,
  MQTT_PROTOCOL,
  MQTT_USERNAME,
  MQTT_PASSWORD,
  SECRET,
} = process.env;

const DB_URL = selectDB();

module.exports = {
  PORT,
  DB_URL,
  MQTT_HOST,
  MQTT_PORT,
  MQTT_PROTOCOL,
  MQTT_USERNAME,
  MQTT_PASSWORD,
  SECRET,
};
