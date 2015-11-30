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

function World(schema) {
  this.tiles = _.map(schema, function(t) {
    return tile({
      position: t.position,
      scale: 50,
      paths: t.paths,
      children: t.cue 
        ? [circle({fill: t.cue, stroke: 'white', thickness: 0.5, scale: 0.08})] 
        : []
    })
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
  return _.indexOf(status, true)
}

World.prototype.cues = function() {
  var cues = []
  this.tiles.forEach(function (tile) {
    var cue = _.find(tile.children, function(child) {return child.props.cue})
    if (cue) cues.push({
      position: tile.transform.position, 
      color: cue.props.fill
    })
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