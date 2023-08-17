const valuesRouter = require('express').Router()

let values = [
    10, 20, 30, 40, 50, 60, 72, 83, 90, 70,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 80,
    21, 22, 23, 24
  ]

/* Get all values of a node */
valuesRouter.get('/', (req, res) => {
    res.json(values)
})

module.exports = valuesRouter