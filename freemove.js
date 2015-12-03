function Freemove (data) {
  this.velocity = data.velocity || {translation: [0, 0], rotation: 0, scale: 0}
  this.speed = data.speed || {translation: 1, rotation: 10, scale: 0}
  this.friction = data.friction || 1
  this.keymap = data.keymap || {translation: [['D', 'A'], ['W', 'S']], rotation: ['E', 'Q'], scale: [',', '.']}
}

Freemove.prototype.compute = function (keys, rotation) {
  var keymap = this.keymap

  if (keymap.translation) {
    if (keymap.translation[0][0] in keys) this.velocity.translation[0] += this.speed.translation
    if (keymap.translation[0][1] in keys) this.velocity.translation[0] -= this.speed.translation
    if (keymap.translation[1][0] in keys) this.velocity.translation[1] += this.speed.translation
    if (keymap.translation[1][1] in keys) this.velocity.translation[1] -= this.speed.translation
  }

  if (keymap.rotation) {
    if (keymap.rotation[0] in keys) this.velocity.rotation += this.speed.rotation
    if (keymap.rotation[1] in keys) this.velocity.rotation -= this.speed.rotation
  }

  if (keymap.scale) {
    if (keymap.scale[0] in keys) this.velocity.scale += this.speed.scale
    if (keymap.scale[1] in keys) this.velocity.scale -= this.speed.scale
  }

  var delta = this.delta(rotation)
  this.dampen()
  return delta
}

Freemove.prototype.delta = function (rotation) {
  var rad = rotation * Math.PI / 180 || 0
  return {
    translation: [
      this.velocity.translation[0] * Math.cos(rad) - this.velocity.translation[1] * Math.sin(rad),
      this.velocity.translation[0] * Math.sin(rad) + this.velocity.translation[1] * Math.cos(rad)
    ],
    rotation: this.velocity.rotation,
    scale: Math.exp(this.velocity.scale)
  }
}

Freemove.prototype.dampen = function () {
  this.velocity.translation[0] *= this.friction
  this.velocity.translation[1] *= this.friction
  this.velocity.rotation *= this.friction
  this.velocity.scale *= this.friction
}

module.exports = Freemove
