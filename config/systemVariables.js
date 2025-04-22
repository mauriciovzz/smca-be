const criteriaPollutants = [
  {
    name: 'pm2.5',
    type: 'enviromental',
    valueType: 'numerical',
    unit: 'µg/m³',
    color: '#4B4B4B',
  },
  {
    name: 'pm10',
    type: 'enviromental',
    valueType: 'numerical',
    unit: 'µg/m³',
    color: '#A9A9A9',
  },
  {
    name: 'o3',
    type: 'enviromental',
    valueType: 'numerical',
    unit: 'ppm',
    color: '#FFCE56',
  },
  {
    name: 'no2',
    type: 'enviromental',
    valueType: 'numerical',
    unit: 'ppb',
    color: '#4BC0C0',
  },
  {
    name: 'so2',
    type: 'enviromental',
    valueType: 'numerical',
    unit: 'ppb',
    color: '#9966FF',
  },
  {
    name: 'co',
    type: 'enviromental',
    valueType: 'numerical',
    unit: 'ppm',
    color: '#FF9F40',
  },
];

const meteorologyVariables = [
  {
    name: 'temperatura',
    type: 'meteorological',
    valueType: 'numerical',
    unit: '°C',
    color: '#FFD700',
  },
  {
    name: 'humedad',
    type: 'meteorological',
    valueType: 'numerical',
    unit: '%',
    color: '#87CEFA',
  },
  {
    name: 'presión',
    type: 'meteorological',
    valueType: 'numerical',
    unit: 'hPa',
    color: '#8A2BE2',
  },
  {
    name: 'precipitación',
    type: 'meteorological',
    valueType: 'presential',
    unit: null,
    color: '#7885AB',
  },
  {
    name: 'radiación solar',
    type: 'meteorological',
    valueType: 'numerical',
    unit: 'mW/cm²',
    color: '#E5E7EB',
  },
];

module.exports = {
  criteriaPollutants,
  meteorologyVariables,
};
