require('dotenv').config();

const {
  PORT,
  MQTT_HOST,
  MQTT_PORT,
  MQTT_PROTOCOL,
  MQTT_USERNAME,
  MQTT_PASSWORD,
} = process.env;

const DB_URL = (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development')
  ? process.env.DB_LOCAL_URL
  : process.env.DB_URL;

module.exports = {
  PORT,
  DB_URL,
  MQTT_HOST,
  MQTT_PORT,
  MQTT_PROTOCOL,
  MQTT_USERNAME,
  MQTT_PASSWORD,
};
