var inherits = require('inherits');
var aabb = require('aabb-2d');
var transform = require('./transform.js')
var Freemove = require('./freemove.js')
var Entity = require('crtrdg-entity');

module.exports = Camera;
inherits(Camera, Entity);

function Camera(opts){
  var self = this
  this.yoked = opts.yoked
  this.transform = transform({
    position: opts.position, 
    scale: opts.scale,
    angle: opts.angle
  })
  this.movement = new Freemove({
    speed: opts.speed,
    friction: opts.friction,
    keymap: {position: [['L','J'],['K','I']], angle: ['O','U'], scale: [',','.']}
  })
}

Camera.prototype.move = function(keyboard) {
  var self = this
  var delta = self.movement.compute(keyboard.keysDown, self.transform.angle)
  self.transform.compose(delta)
}