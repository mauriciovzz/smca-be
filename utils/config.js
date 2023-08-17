require('dotenv').config()

const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

const MQTT_HOST = process.env.MQTT_HOST
const MQTT_PORT = process.env.MQTT_PORT
const MQTT_PROTOCOL = process.env.MQTT_PROTOCOL
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD

module.exports = {
    DATABASE_URL,
    PORT,
    MQTT_HOST,
    MQTT_PORT,
    MQTT_PROTOCOL,
    MQTT_USERNAME,
    MQTT_PASSWORD
}