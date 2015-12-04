var _ = require('lodash')
var inherits = require('inherits')
var tile = require('../geometry/tile.js')
var circle = require('../geometry/circle.js')
var hex = require('../geometry/hex.js')
var Entity = require('crtrdg-entity')

module.exports = World
inherits(World, Entity)

function World (schema, opts) {
  this.opts = opts || {}
  this.load(schema)
}

World.prototype.load = function (schema) {
  var self = this
  self.tiles = _.map(schema, function (t) {
    var children = []
    if (t.cue) {
      children.push(circle({
        fill: t.cue.fill,
        stroke: 'white',
        thickness: 0.5,
        scale: 0.08,
        cue: true
      }))
    }
    if (t.target) {
      children.push(hex({
        fill: t.target.fill,
        stroke: 'white',
        thickness: 0.5,
        scale: 0.1,
        target: true
      }))
    }
    return tile({
      scale: 50,
      translation: t.translation,
      paths: t.paths,
      children: children,
      thickness: self.opts.thickness
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

World.prototype.targets = function () {
  var targets = []
  this.tiles.forEach(function (tile) {
    var target = _.find(tile.children, function (child) { return child.props.target })
    if (target) targets.push(target)
  })
  return targets
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
