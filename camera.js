var inherits = require('inherits')
var transform = require('transformist')
var Entity = require('crtrdg-entity')
var Freemove = require('./freemove.js')

module.exports = Camera
inherits(Camera, Entity)

function Camera (opts) {
  this.yoked = opts.yoked
  this.transform = transform({
    translation: opts.translation,
    scale: opts.scale,
    rotation: opts.rotation
  })
  this.movement = new Freemove({
    speed: opts.speed,
    friction: opts.friction,
    keymap: { translation: [['L', 'J'], ['K', 'I']], rotation: ['O', 'U'], scale: [',', '.'] }
  })
}

Camera.prototype.move = function (keyboard) {
  var self = this
  var delta = self.movement.compute(keyboard.keysDown, self.transform.rotation)
  self.transform.compose(delta)
}
