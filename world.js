var tile = require('./geo/tile.js')
var hex = require('./geo/hex.js')
var circle = require('./geo/circle.js')
var path = require('./geo/path.js')

module.exports = World

function World() {
  this.tiles = [
    tile({
      position: [-1, 0],
      scale: 50,
      children: [hex({scale: 0.25}), path({angle: 0}), path({angle: 240}), path({angle: 300})]
    }),
    tile({
      position: [0, 0],
      scale: 50,
      children: [
        path({angle: 0}), path({angle: 120}), path({angle: 240}),
        circle({scale: 0.25, children: [circle({fill: 'white', stroke: 'white', scale: 0.5})]})
      ]
    }),
    tile({
      position: [0, 1],
      scale: 50,
      children: [hex({scale: 0.25}), path({angle: 120}), path({angle: 180}), path({angle: 240})]
    }),
    tile({
      position: [-1, 1],
      scale: 50,
      children: [hex({scale: 0.25}), path({angle: 240}), path({angle: 300})]
    }),
    tile({
      position: [1, -1],
      scale: 50,
      children: [hex({scale: 0.25}), path({angle: 120})]
    }),
    tile({
      position: [1, 0],
      scale: 50,
      children: [hex({scale: 0.25}), path({angle: 60}), path({angle: 180})]
    }),
    tile({
      position: [0, -1],
      scale: 50,
      children: [hex({scale: 0.25}), path({angle: 60}), path({angle: 300})]
    })
  ]
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