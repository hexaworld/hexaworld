var _ = require('lodash')
var transform = require('./transform.js')

function Movement(data) {
  this.velocity = data.velocity || transform({position: [0, 0], angle: 0, scale: 0})
  this.speed = data.speed || 1
  this.friction = data.friction || 0
  this.keymap = data.keymap || ['A','D','S','W','Q','E',',','.']
}

Movement.prototype.update = function(keys) {
  var self = this
  var down = []
  self.keymap.forEach(function (key, i) {if (key in keys) down.push(i)})
  var inc = function(ind) {return (down.indexOf(ind) > -1 ? self.speed : 0)}
  var dec = function(ind) {return (down.indexOf(ind) > -1 ? -self.speed : 0)}
  var delta = {
    position: [dec(0) + inc(1), dec(2) + inc(3)],
    angle: dec(4) + inc(5),
    scale: dec(6) + inc(7)
  }
  self.velocity.add(delta)
}

Movement.prototype.apply = function(transform) {
  var rad = transform.angle() * Math.PI / 180
  var delta = {}
  delta.position = [
    this.velocity.position()[0] * Math.cos(rad) - this.velocity.position()[1] * Math.sin(rad),
    this.velocity.position()[0] * Math.sin(rad) + this.velocity.position()[1] * Math.cos(rad)
  ]
  delta.angle = this.velocity.angle()
  delta.scale = this.velocity.scale()
  transform.add(delta)
  this.dampen()
}

Movement.prototype.dampen = function() {
  var delta = {
    position: [this.friction, this.friction],
    angle: this.friction,
    scale: this.friction
  }
  this.velocity.multiply(delta)
}

module.exports = Movement