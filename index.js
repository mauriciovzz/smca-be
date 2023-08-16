const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)

let nodes = [
  {
    type: "OUTDOOR",
    id: "001",
    
  },
  {
    type: "INDOOR",
    id: "001",
    
  }
]

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

let values = [
  10, 20, 30, 40, 50, 60, 72, 83, 90, 70,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 80,
  21, 22, 23, 24
]

// Nodes -------------------------------------------------------

/* Get all nodes */
app.get('/api/nodes', (req, res) => {
  res.json(node_locations)
})

// Locations-----------------------------------------------------

/* Get all locations */
app.get('/api/locations', (req, res) => {
  res.json(locations)
})

/* Get a location */
app.get('/api/locations/:type/:id', (req, res) => {
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

// Variables -----------------------------------------------------

/* Get all variables of a node */
app.get('/api/variables', (req, res) => {
  res.json(variables)
})

// Values -----------------------------------------------------

/* Get all values of a node */
app.get('/api/values', (req, res) => {
  res.json(values)
})

// --------------------------------------------------------------
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})