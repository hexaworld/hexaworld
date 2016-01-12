var _ = require('lodash')
var inherits = require('inherits')
var tile = require('../geometry/tile.js')
var circle = require('../geometry/circle.js')
var hex = require('../geometry/hex.js')
var hexrgb = require('hex-rgb')
var Geometry = require('../geometry/geometry.js')
var Entity = require('crtrdg-entity')

module.exports = World
inherits(World, Entity)

function World (schema, opts) {
  this.opts = opts || {}
  this.reload(schema)
}

World.prototype.reload = function (schema) {
  var self = this

  self._tileCache = {}
  self.tiles = _.map(schema, function (t) {
    var children = []
    if (t.cue) {
      var scale = 0.16
      if (t.cue.scale === 1) scale = 0.13
      if (t.cue.scale === 2) scale = 0.16
      if (t.cue.scale === 3) scale = 0.19
      children.push(hex({
        // fill: t.cue.fill,
        scale: scale,
        cue: true,
        surface: true,
        color: hexrgb(t.cue.fill),
        height: 4.3
      }))
    }
    if (t.target) {
      children.push(hex({
        // fill: t.target.fill,
        // stroke: t.target.fill,
        scale: 0.09,
        target: true,
        surface: true,
        color: hexrgb(t.target.fill),
        lit: true,
        height: 4.3
      }))
    }

    var tileObj = tile({
      scale: 50,
      translation: t.translation,
      paths: t.paths,
      children: children,
      thickness: self.opts.thickness,
      surface: true,
    })

    var x = t.translation[0]
    var y = t.translation[1]

    var rowCache = self._tileCache[x] || {}
    rowCache[y] = tileObj
    self._tileCache[x] = rowCache

    return tileObj
  })

  self.floor = hex({
    surface: true,
    height: 1,
    color: [10, 10, 10],
    scale: 400,
    lit: false,
    height: 0.5
  })
}

World.prototype.draw = function (context, camera, light) {
  this.tiles.forEach(function (tile) {
    tile.draw(context, camera, light)
  })
  this.floor.draw(context, camera, light)
}

World.prototype.locate = function (point) {
  var status = this.tiles.map(function (tile) {
    return tile.contains(point)
  })
  return _.indexOf(status, true)
}

World.prototype.gettile = function (point) {
  return this._tileCache[point[0]][point[1]]
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
      var scale
      if (cue.transform.scale === 0.13) scale = 90
      if (cue.transform.scale === 0.16) scale = 180
      if (cue.transform.scale === 0.19) scale = 270
      cues.push({
        translation: tile.transform.translation,
        color: cue.props.fill,
        scale: scale
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
