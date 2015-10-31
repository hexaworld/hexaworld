var inherits = require('inherits');
var aabb = require('aabb-2d');
var transform = require('./transform.js')
var Movement = require('./movement.js')
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
  this.movement = new Movement({
    speed: opts.speed,
    friction: opts.friction,
    keymap: {position: [['J','L'],['K','I']], angle: ['U','O'], scale: [',','.']}
  })
}

Camera.prototype.move = function(keyboard) {
  var self = this
  console.log(keyboard.keysDown)
  self.movement.update(keyboard.keysDown)
  self.movement.apply(self.transform)
}