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
  
  this.maxangle = opts.maxangle || 360
  this.minangle = opts.minangle || 30
  this.maxdistance = opts.maxdistance || 100

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
  self = this

  return targets.map(function (target) {
    var diff = origin.difference(target)
    var dist = origin.distance(target)

    var radius = dist.position / self.maxdistance
    var angle = Math.atan2(-diff.position[1], -diff.position[0]) * 180 / Math.PI

    if (angle < 0) angle += 360
    angle = angle - 90
    if (angle < 0) angle += 360

    var offset = -origin.angle() % 360
    if (offset < 0) offset += 360
    offset = 360 - offset
    if (offset == 360) offset = 0

    angle -= offset
    if (angle < 0) angle += 360
    if (radius < .01) angle = 0

    var interp = Math.max(1 - radius, 0.5)
    var fill = color.interpolateHsl('rgb(55,55,55)', target.color)(interp)

    return {angle: angle, radius: radius, fill: fill}
  })
}

Ring.prototype.update = function(player, world) {
  self = this

  var projections = this.project(player.geometry.transform, world.cues())

  function discretize(i, p, length) {
    var tmp = p.angle - i * 360.0/length
    if (tmp > 180) tmp = 360 - tmp
    if (tmp < -180) tmp = 360 + tmp
    
    if (Math.abs(tmp) <= Math.min(self.minangle/p.radius, self.maxangle)/2 & p.radius < 1) {
      return {radius: p.radius, fill: color.rgb(p.fill)}
    }
  }

  var colors = this.notches.map( function(notch, i) {
    var fills = _.remove(projections.map( function(p) {return discretize(i, p, self.notches.length)}))
    if (!fills.length) return 'rgb(55,55,55)'
    var nonzero = _.filter(fills, function(f) {return f.radius > 0.2})
    if (nonzero.length) return _.min(nonzero, function(f) {return f.radius}).fill.toString()
    return fills[0].fill.toString() 
  })

  this.recolor(colors)
}