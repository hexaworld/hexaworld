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
        fill: t.cue.fill,
        scale: scale,
        cue: true
      }))
    }
    if (t.target) {
      children.push(circle({
        fill: t.target.fill,
        stroke: t.target.fill,
        thickness: 0.75,
        scale: 0.09,
        target: true
      }))
    }

    var tileObj = tile({
      scale: 50,
      translation: t.translation,
      paths: t.paths,
      children: children,
      thickness: self.opts.thickness
    })

    var x = t.translation[0]
    var y = t.translation[1]

    var rowCache = self._tileCache[x] || {}
    rowCache[y] = tileObj
    self._tileCache[x] = rowCache

    return tileObj
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
