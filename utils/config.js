require('dotenv').config();

const {
  PORT,
  DATABASE_URL,
  MQTT_HOST,
  MQTT_PORT,
  MQTT_PROTOCOL,
  MQTT_USERNAME,
  MQTT_PASSWORD,
  DB_URL,
  DB_LOCAL_URL,
} = process.env;

module.exports = {
  DATABASE_URL,
  PORT,
  MQTT_HOST,
  MQTT_PORT,
  MQTT_PROTOCOL,
  MQTT_USERNAME,
  MQTT_PASSWORD,
  DB_URL,
  DB_LOCAL_URL,
};
