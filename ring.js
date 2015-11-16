var _ = require('lodash')
var inherits = require('inherits')
var color = require('d3-color')
var notch = require('./geo/notch.js')
var cap = require('./geo/cap.js')
var Entity = require('crtrdg-entity')

module.exports = Ring;
inherits(Ring, Entity);

function Ring(opts){

  var fill = opts.fill
  var offset = opts.offset || 0
  var count = opts.count || 6
  var extent = opts.extent || 20
  var size = opts.size || 50
  var position = opts.position || [size/2, size/2]

  var notches = _.flatten(_.range(6).map(function (side) {
    return _.range(1, count-1).map(function (ind) {
      return notch({
        size: size, 
        extent: extent, 
        ind: ind, 
        count: count, 
        offset: offset, 
        angle: (side * 60) + 30,
        position: position
      })
    })
  }))

  var caps = _.range(6).map(function (side) {
    return cap({
      size: size,
      extent: extent,
      count: count,
      offset: offset,
      angle: (side * 60) + 30,
      position: position
    })
  })

  _.range(6).forEach(function(i) {
    notches.splice(i*(opts.count-1), 0, caps[i])
  })

  this.notches = notches
}

Ring.prototype.draw = function(context) {
  this.notches.forEach( function(notch) {
    notch.draw(context)
  })
}

Ring.prototype.recolor = function(colors) {
  this.notches.forEach(function(notch, i) {
    notch.props.fill = colors[i]
  })
}

Ring.prototype.project = function(origin, targets) {
  return targets.map(function (target) {
    var diff = origin.difference(target)
    var dist = origin.distance(target)

    var radius = dist.position / 100
    var angle = Math.atan2(-diff.position[1], -diff.position[0]) * 180 / Math.PI

    if (angle < 90) angle += 360
    angle = 90 - angle

    var offset = origin.angle() % 360
    if (offset < 0) offset += 360
    angle += offset

    var interp = Math.max(1 - radius, 0.5)
    var fill = color.interpolateHsl('rgb(55,55,55)', target.color)(interp)

    return {angle: angle, radius: radius, fill: fill}
  })
}

Ring.prototype.update = function(player, world) {
  var projections = this.project(player.geometry.transform, world.cues())

  function discretize(i, p) {
    tmp = p.angle + i * 360/30
    if (tmp > 180) tmp = 360 - tmp
    if (Math.abs(tmp) <= Math.min(60/p.radius * (Math.sqrt(3)/2)/2, 360)/2 & p.radius < 1) {
      return {radius: p.radius, fill: color.rgb(p.fill)}
    }
  }

  var colors = this.notches.map( function(notch, i) {
    var fills = projections.map( function(p) {return discretize(i, p)})
    if (!_.any(fills)) return 'rgb(55,55,55)'
    return _.min(_.remove(fills), function(f) {return f.radius}).fill.toString()
  })

  this.recolor(colors)
}