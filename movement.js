var _ = require('lodash')
var transform = require('./transform.js')

function Movement(data) {
  this.velocity = data.velocity || {position: [0, 0], angle: 0, scale: 0}
  this.speed = data.speed || 1
  this.friction = data.friction || 0
  this.keymap = data.keymap || {position: [['D','A'],['W','S']], angle: ['E','Q'], scale: [',','.']}
}

Movement.prototype.compute = function(keys, angle) {
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
  
  var delta = this.delta(angle)
  this.dampen()
  return delta

}

Movement.prototype.delta = function(angle) {
  var rad = angle * Math.PI / 180 || 0
  return {
    position: [
      this.velocity.position[0] * Math.cos(rad) - this.velocity.position[1] * Math.sin(rad),
      this.velocity.position[0] * Math.sin(rad) + this.velocity.position[1] * Math.cos(rad)
    ],
    angle: this.velocity.angle,
    scale: Math.exp(this.velocity.scale)
  }
}

Movement.prototype.dampen = function() {
  this.velocity.position[0] *= this.friction
  this.velocity.position[1] *= this.friction
  this.velocity.angle *= this.friction
  this.velocity.scale *= this.friction
}

module.exports = Movement