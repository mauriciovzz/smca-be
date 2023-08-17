const nodesRouter = require('express').Router()

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
  
/* Get all nodes */
nodesRouter.get('/', (req, res) => {
	res.json(node_locations)
});

module.exports = nodesRouter