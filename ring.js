var _ = require('lodash')
var inherits = require('inherits')
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

  this.notches = notches.concat(caps)

}

Ring.prototype.draw = function(context) {
  this.notches.forEach( function(notch) {
    notch.draw(context)
  })
}

Ring.prototype.update = function(colors) {
  this.notches.forEach( function(notch, i) {
    notch.props.fill = colors[i]
  })
}