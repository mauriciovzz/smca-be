const Joi = require('joi');
const schemaVariables = require('./schemaVariables');

const readingsParams = Joi.object({
  nodeId: schemaVariables.id('node (id)'),
  locationId: schemaVariables.id('location (id)'),
  date: schemaVariables.date,
});

module.exports = {
  readingsParams,
};
