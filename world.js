var _ = require('lodash')
var inherits = require('inherits')
var color = require('d3-color')
var tile = require('./geo/tile.js')
var hex = require('./geo/hex.js')
var circle = require('./geo/circle.js')
var wedge = require('./geo/wedge.js')
var block = require('./geo/block.js')
var Entity = require('crtrdg-entity')

module.exports = World
inherits(World, Entity)

function World(opts) {
  this.player = opts.player

  this.tiles = [
    tile({
      position: [0, 0],
      scale: 50,
      paths: [0, 2, 4],
      children: [circle({
        fill: '#64FF00', 
        stroke: 'white', 
        thickness: 0.5, 
        scale: 0.08
      })]
    }),
    tile({
      position: [-1, 0],
      scale: 50,
      paths: [0, 4, 5],
      children: [circle({
        fill: '#00C3EE', 
        stroke: 'white', 
        thickness: 0.5, 
        scale: 0.08
      })]
    }),
    tile({
      position: [0, 1],
      scale: 50,
      paths: [2, 3, 4]
    }),
    tile({
      position: [-1, 1],
      scale: 50,
      paths: [4, 5],
      children: [circle({
        fill: '#FF8900', 
        stroke: 'white', 
        thickness: 0.5, 
        scale: 0.08
      })]
    }),
    tile({
      position: [1, -1],
      scale: 50,
      paths: [2, 3]
    }),
    tile({
      position: [1, 0],
      scale: 50,
      paths: [1, 3]
    }),
    tile({
      position: [0, -1],
      scale: 50,
      paths: [1, 3, 5]
    }),
    tile({
      position: [0, -2],
      scale: 50,
      paths: [0, 5]
    }),
    tile({
      position: [1, -2],
      scale: 50,
      paths: [0, 2],
      children: [circle({
        fill: '#FF5050', 
        stroke: 'white', 
        thickness: 0.5, 
        scale: 0.08
      })]      
    })
  ]

  this.on('update', function(interval) {
    var self = this
    var point = self.player.position()
    var ind = self.locate(point)
    if (self.tiles[ind].children[0].contains(point)) {
      self.emit('location', 'inside tile ' + ind)
    }
  })
}

World.prototype.draw = function(context, camera) {
  this.tiles.forEach(function (tile) {
    tile.draw(context, camera)
  })
}

World.prototype.locate = function(point) {
  var status = this.tiles.map(function (tile) {
    return tile.contains(point)
  })
  var ind = _.indexOf(status, true)
  if (ind === -1) throw Error('Cannot find player in a tile')
  return ind
}

World.prototype.cues = function() {
  var cues = []
  this.tiles.forEach(function (tile) {
    var cue = _.find(tile.children, function(child) {return child.props.cue})
    if (cue) cues.push({position: tile.transform.position(), color: cue.props.fill})
  })
  return cues
}

World.prototype.intersects = function(geometry) {
  var self = this
  var results = []
  this.tiles.forEach(function (tile) {
    tile.children.forEach(function (child) {
      if (child.props.obstacle) {
        var collision = child.intersects(geometry)
        if (collision) results.push(collision)
      }
    })
  })
  if (results.length) return(results)
}