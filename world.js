var Tile = require('./tile.js')
var Path = require('./path.js')
var Center = require('./center.js')

module.exports = World

function World() {
  this.tiles = [
    new Tile({coordinate: {r: -1, q: 0}}, [new Center(), new Path(), new Path({rotation: 240}), new Path({rotation: 300})]), 
//    new Tile({coordinate: {r: 0, q: 0}}, [new Center(null, [new Center({fill: 'blue', scale:.5})]), new Path(), new Path({rotation: 120}), new Path({rotation: 240})]), 
    new Tile({coordinate: {r: 0, q: 0}}, [new Path(), new Path({rotation: 120}), new Path({rotation: 240}), new Center(null, [new Center({fill: 'blue', scale:.5})])]), 
    new Tile({coordinate: {r: 0, q: 1}}, [new Center(), new Path({rotation: 120}), new Path({rotation: 180}), new Path({rotation: 240})]),
    new Tile({coordinate: {r: -1, q: 1}}, [new Center(), new Path({rotation: 240}), new Path({rotation: 300})]),
    new Tile({coordinate: {r: 1, q: -1}}, [new Center(),  new Path(), new Path({rotation: 120})]),
    new Tile({coordinate: {r: 1, q: 0}}, [new Center(), new Path({rotation: 60}), new Path({rotation: 180})]),
    new Tile({coordinate: {r: 0, q: -1}}, [new Center(), new Path({rotation: 60}), new Path({rotation: 300})])
  ]
  console.log(this.tiles[0])
}

World.prototype.render = function(context, camera) {
  // figure out which tiles to show given the camera position
  this.tiles.forEach(function (tile) {
    tile.render(context, camera)
  })
}

World.prototype.boundaries = function(camera) {
  // figure out which tiles to check given the camera position
  // for those tiles, check whether we're intersecting the bounding boxes of any objects
}