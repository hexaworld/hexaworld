var _ = require('lodash')
var inherits = require('inherits')
var color = require('d3-color')
var notch = require('../geometry/notch.js')
var cap = require('../geometry/cap.js')
var Entity = require('crtrdg-entity')

module.exports = Ring
inherits(Ring, Entity)

function Ring (opts) {
  var offset = opts.offset || 0
  var count = opts.count || 6
  var extent = opts.extent || 20
  var size = opts.size || 50
  var translation = opts.translation || [size / 2, size / 2]

  this.maxangle = opts.maxangle || 360
  this.minangle = opts.minangle || 20

  var notches = _.flatten(_.range(6).map(function (side) {
    return _.range(1, count - 1).map(function (ind) {
      return notch({
        size: size,
        extent: extent,
        ind: ind,
        count: count,
        offset: offset,
        rotation: (side * 60) + 30,
        translation: translation
      })
    })
  }))

  var caps = _.range(6).map(function (side) {
    return cap({
      size: size,
      extent: extent,
      count: count,
      offset: offset,
      rotation: (side * 60) + 30,
      translation: translation
    })
  })

  _.range(6).forEach(function (i) {
    notches.splice(i * (opts.count - 1), 0, caps[i])
  })

  this.notches = notches
  this.flashing = false
  this.flashingColors = []
}

Ring.prototype.draw = function (context) {
  if (this.flashing) this.flash()
  this.notches.forEach(function (notch) {
    notch.draw(context)
  })
}

Ring.prototype.recolor = function (colors) {
  this.notches.forEach(function (notch, i) {
    notch.props.fill = colors[i]
  })
}

Ring.prototype.startFlashing = function (colors) {
  this.flashingColors = colors
  this.flashing = true
}

Ring.prototype.stopFlashing = function () {
  this.flashing = false
  this.flashingColors = []
}

Ring.toggleFlashing = function (colors) {
  this.flashing ? this.stopFlashing() : this.startFlashing(colors)
}

Ring.prototype.flash = function () {
  var colors = this.colors
  this.notches.forEach(function (notch, i) {
    if (colors[i] === 'rgb(55,55,55)') {
      if (Math.random() > 0.5) {
        notch.props.fill = 'rgb(230,230,230)'
      } else {
        notch.props.fill = 'rgb(130,130,130)'
      }
    } else {
      if (Math.random() > 0.5) {
        notch.props.fill = color.interpolateHsl(colors[i], 'rgb(230,230,230)')(0.2)
      } else {
        notch.props.fill = color.interpolateHsl(colors[i], 'rgb(130,130,130)')(0.2)
      }
    }
  })
}

Ring.prototype.project = function (origin, targets) {
  return targets.map(function (target) {
    var diff = origin.difference(target)
    var dist = origin.distance(target)

    var radius = dist.translation / target.scale
    var angle = Math.atan2(-diff.translation[1], -diff.translation[0]) * 180 / Math.PI

    if (angle < 0) angle += 360
    angle = angle - 90
    if (angle < 0) angle += 360

    var offset = -origin.rotation % 360
    if (offset < 0) offset += 360
    offset = 360 - offset
    if (offset === 360) offset = 0

    angle -= offset
    if (angle < 0) angle += 360
    if (radius < 0.01) angle = 0

    var fill = color.interpolateHsl('rgb(55,55,55)', target.color)(0.85)

    return { angle: angle, radius: radius, fill: fill }
  })
}

Ring.prototype.update = function (player, world) {
  var self = this

  var projections = this.project(player.geometry.transform, world.cues())

  function discretize (i, p, length) {
    var tmp = p.angle - i * 360.0 / length
    if (tmp > 180) tmp = 360 - tmp
    if (tmp < -180) tmp = 360 + tmp

    if (Math.abs(tmp) <= Math.min(self.minangle / p.radius, self.maxangle) / 2 & p.radius < 1) {
      return { radius: p.radius, fill: color.rgb(p.fill) }
    }
  }

  var colors = this.notches.map(function (notch, i) {
    var fills = _.remove(projections.map(function (p) { return discretize(i, p, self.notches.length) }))
    if (!fills.length) return 'rgb(55,55,55)'
    var nonzero = _.filter(fills, function (f) { return f.radius > 0.2 })
    if (nonzero.length) return _.min(nonzero, function (f) { return f.radius }).fill.toString()
    return fills[0].fill.toString()
  })

  this.colors = colors
  this.recolor(colors)
}
