var inherits = require('inherits');
var aabb = require('aabb-2d');
var Entity = require('crtrdg-entity');
var transform = require('./transform.js')

module.exports = Camera;
inherits(Camera, Entity);

function Camera(opts){
  var self = this
  this.speed = opts.speed
  this.friction = opts.friction
  this.velocity = opts.velocity
  this.yoked = opts.yoked
  this.transform = transform({
    position: opts.position, 
    scale: opts.scale,
    angle: opts.angle
  })
}

Camera.prototype.move = function(velocity) {
  var self = this

  var rad = self.transform.angle() * Math.PI / 180
  var delta = {}
  delta.position = [
    velocity.position[0] * Math.cos(rad) - velocity.position[1] * Math.sin(rad),
    velocity.position[0] * Math.sin(rad) + velocity.position[1] * Math.cos(rad)
  ]
  delta.angle = velocity.angle
  delta.scale = velocity.scale

  self.transform.update(delta)
}

Camera.prototype.keyboardInput = function(keyboard){
  if ('J' in keyboard.keysDown){
    this.velocity.position[0] = -this.speed
  }

  if ('L' in keyboard.keysDown){
    this.velocity.position[0] = this.speed
  }

  if ('I' in keyboard.keysDown){
    this.velocity.position[1] = -this.speed
  }

  if ('K' in keyboard.keysDown){
    this.velocity.position[1] = this.speed
  }

  if ('O' in keyboard.keysDown){
    this.velocity.angle = -this.speed
  }

  if ('U' in keyboard.keysDown){
    this.velocity.angle = this.speed
  }

  if ('.' in keyboard.keysDown){
    this.velocity.scale = -this.speed / 10
  }

  if (',' in keyboard.keysDown){
    this.velocity.scale = this.speed / 10
  }
}

Camera.prototype.dampen = function() {
  this.velocity.position[0] *= this.friction
  this.velocity.position[1] *= this.friction
  this.velocity.angle *= this.friction
  this.velocity.scale *= this.friction
}