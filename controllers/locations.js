const locationsRouter = require('express').Router()

let node_locations = [
  {
    type: "OUTDOOR",
    id: "001",
    lat: 8.2973,
    long: -62.7114
  },
  {
    type: "INDOOR",
    id: "001",
    lat: 8.2945,
    long: -62.7199
  }
]

let locations = [
  {
    nom: "UCAB Guayana",
    lat: 8.2973,
    long: -62.7114
  },
  {
    lat: 8.2945,
    long: -62.7199,
    nom: "ARIVANA"
  }
]

/* Get all locations */
locationsRouter.get('/', (req, res) => {
  res.json(locations)
})
  
  /* Get a location */
locationsRouter.get('/:type/:id', (req, res) => {
  const node_type = req.params.type
  const node_id = req.params.id

  const location_search = node_locations.find(loc => 
      ((loc.type === node_type) && (loc.id === node_id))
  )

  const location = locations.find(loc => 
      ((loc.lat === location_search.lat) && (loc.long === location_search.long))
  )

  if (location) {
      res.json(location)
  } else {
      res.status(404).end()
  }
});

module.exports = locationsRouter