var _ = require('lodash')
var inherits = require('inherits')
var tile = require('./geo/tile.js')
var circle = require('./geo/circle.js')
var Entity = require('crtrdg-entity')

module.exports = World
inherits(World, Entity)

function World (schema, opts) {
  opts = opts || {}
  this.tiles = _.map(schema, function (t) {
    return tile({
      scale: 50,
      translation: t.translation,
      paths: t.paths,
      children: t.cue && t.cue.length > 0
        ? [circle({ fill: t.cue, stroke: 'white', thickness: 0.5, scale: 0.08 })]
        : [],
      thickness: opts.thickness
    })
  })
}

World.prototype.draw = function (context, camera) {
  this.tiles.forEach(function (tile) {
    tile.draw(context, camera)
  })
}

World.prototype.locate = function (point) {
  var status = this.tiles.map(function (tile) {
    return tile.contains(point)
  })
  return _.indexOf(status, true)
}

World.prototype.cues = function () {
  var cues = []
  this.tiles.forEach(function (tile) {
    var cue = _.find(tile.children, function (child) { return child.props.cue })
    if (cue) {
      cues.push({
        translation: tile.transform.translation,
        color: cue.props.fill
      })
    }
  })
  return cues
}

World.prototype.intersects = function (geometry) {
  var results = []
  this.tiles.forEach(function (tile) {
    tile.children.forEach(function (child) {
      if (child.props.obstacle) {
        var collision = child.intersects(geometry)
        if (collision) results.push(collision)
      }
    })
  })
  if (results.length) return results
}
