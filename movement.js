var _ = require('lodash')
var transform = require('./transform.js')

function Movement(data) {
  this.velocity = data.velocity || transform({position: [0, 0], angle: 0, scale: 1})
  this.speed = data.speed || 1
  this.friction = data.friction || 0
  this.keymap = data.keymap || {position: [['A','D'],['S','W']], angle: ['Q','E'], scale: [',','.']}
}

Movement.prototype.update = function(keys) {
  var keymap = this.keymap

  var d = {}

  if (keymap.position) {
    d.position = [0, 0]
    if (keymap.position[0][0] in keys) d.position[0] += this.speed
    if (keymap.position[0][1] in keys) d.position[0] -= this.speed
    if (keymap.position[1][0] in keys) d.position[1] += this.speed
    if (keymap.position[1][1] in keys) d.position[1] -= this.speed
  }

  if (keymap.angle) {
    d.angle = 0
    if (keymap.angle[0] in keys) d.angle += this.speed
    if (keymap.angle[1] in keys) d.angle -= this.speed
  }

  if (keymap.scale) {
    d.scale = 0
    if (keymap.scale[0] in keys) d.scale += this.speed * 0.001
    if (keymap.scale[1] in keys) d.scale -= this.speed * 0.001
  }

  this.velocity.add(d)

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
  //console.log(this.velocity.scale())
  console.log(delta.scale)
  //console.log(transform.scale())
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