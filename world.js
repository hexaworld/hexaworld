var _ = require('lodash')
var inherits = require('inherits')
var tile = require('./geo/tile.js')
var hex = require('./geo/hex.js')
var circle = require('./geo/circle.js')
var path = require('./geo/path.js')
var Entity = require('crtrdg-entity')

module.exports = World
inherits(World, Entity)

function World(opts) {
  this.player = opts.player

  this.tiles = [
    tile({
      position: [0, 0],
      scale: 50,
      children: [
        circle({scale: 0.25, children: [circle({fill: 'white', stroke: 'white', scale: 0.5})]}),
        path({angle: 0}), path({angle: 120}), path({angle: 240})
      ]
    }),
    tile({
      position: [-1, 0],
      scale: 50,
      children: [hex({scale: 0.25}), path({angle: 0}), path({angle: 240}), path({angle: 300})]
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

  this.on('update', function(interval) {
    var self = this
    var ind = self.location(self.player.position())
    if (this.tiles[ind].children[0].contains(self.player.position())) {
      this.emit('location', 'inside tile ' + ind)
    }
  })
}

World.prototype.draw = function(context, camera) {
  this.tiles.forEach(function (tile) {
    tile.draw(context, camera)
  })
}

World.prototype.location = function(point) {
  var status = this.tiles.map(function (tile) {
    return tile.contains(point)
  })
  return _.indexOf(status, true)
}

World.prototype.contains = function(point) {
  var status = this.tiles.map(function (tile) {
    return tile.children.map(function (child) {
      return child.contains(point)
    })
  })
  return _.any(_.flatten(status))
}