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

    var interp = Math.max(1 - radius, 0)
    var fill = color.interpolateHsl('rgb(10,10,10)', target.color)(interp)

    return {angle: angle, radius: radius, fill: fill}
  })
}

Ring.prototype.update = function(player, world) {
  var projections = this.project(player.geometry.transform, world.cues())

  function threshold(i, p) {
    tmp = p.angle + i * 360/30
    if (tmp > 180) tmp = 360 - tmp
    if (Math.abs(tmp) <= Math.min(60/p.radius * (Math.sqrt(3)/2)/2, 360)/2 & p.radius < 1) {
      return color.rgb(p.fill)
    } else {
      return color.rgb('rgb(55,55,55)')
    }
  }

  var colors = this.notches.map( function(notch, i) {
    var fills = projections.map( function(p) {return threshold(i, p)})
    var max = color.rgb('rgb(55,55,55)')
    fills.forEach( function(f) {
      max.r = Math.max(max.r, f.r)
      max.g = Math.max(max.g, f.g)
      max.b = Math.max(max.b, f.b)
    })
    return max.toString()
  })

  this.recolor(colors)
}