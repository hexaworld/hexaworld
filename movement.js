var _ = require('lodash')
var transform = require('./transform.js')

function Movement(data) {
  this.velocity = data.velocity || {position: [0, 0], angle: 0, scale: 0}
  this.speed = data.speed || 1
  this.friction = data.friction || 0
  this.keymap = data.keymap || {position: [['A','D'],['S','W']], angle: ['Q','E'], scale: [',','.']}
}

Movement.prototype.update = function(keys) {
  var keymap = this.keymap

  if (keymap.position) {
    if (keymap.position[0][0] in keys) this.velocity.position[0] += this.speed
    if (keymap.position[0][1] in keys) this.velocity.position[0] -= this.speed
    if (keymap.position[1][0] in keys) this.velocity.position[1] += this.speed
    if (keymap.position[1][1] in keys) this.velocity.position[1] -= this.speed
  }

  if (keymap.angle) {
    if (keymap.angle[0] in keys) this.velocity.angle += this.speed
    if (keymap.angle[1] in keys) this.velocity.angle -= this.speed
  }

  if (keymap.scale) {
    if (keymap.scale[0] in keys) this.velocity.scale += this.speed*.01
    if (keymap.scale[1] in keys) this.velocity.scale -= this.speed*.01
  }

}

Movement.prototype.apply = function(transform) {
  var rad = transform.angle() * Math.PI / 180
  var delta = {}
  delta.position = [
    this.velocity.position()[0] * Math.cos(rad) - this.velocity.position()[1] * Math.sin(rad),
    this.velocity.position()[0] * Math.sin(rad) + this.velocity.position()[1] * Math.cos(rad)
  ]
  //console.log(this.velocity.scale())
  delta.angle = this.velocity.angle()
  delta.scale = Math.exp(this.velocity.scale())
  transform.compose(delta)
  this.dampen()
}

Movement.prototype.dampen = function() {
  this.velocity.position[0] *= this.friction
  this.velocity.position[1] *= this.friction
  this.velocity.angle *= this.friction
  this.velocity.scale[0] *= this.friction
}

module.exports = Movement