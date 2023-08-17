const variablesRouter = require('express').Router()

let variables = [
    {
      id: "temp",
      title: "Temperatura"
    },
    {
      id: "hum",
      title: "Humedad"
    },
    {
      id: "pres",
      title: "Presion"
    },
    {
      id: "uvl",
      title: "Rayos UV"
    }
]

/* Get all variables of a node */
variablesRouter.get('/', (req, res) => {
    res.json(variables)
  })

module.exports = variablesRouter