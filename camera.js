var inherits = require('inherits');
var aabb = require('aabb-2d');
var Entity = require('crtrdg-entity');

module.exports = Camera;
inherits(Camera, Entity);

function Camera(options){
  this.position = { 
    x: options.position.x, 
    y: options.position.y,
    z: options.position.z
  }
  this.orientation = options.orientation
  this.speed = options.speed
  this.friction = options.friction
  this.yoked = options.yoked
  this.velocity = {
    x: options.velocity.x,
    y: options.velocity.y,
    z: options.velocity.z
  }
}

Camera.prototype.move = function(velocity) {
  this.position.x += velocity.x
  this.position.y += velocity.y
  this.position.z += velocity.z * 0.1
}

Camera.prototype.keyboardInput = function(keyboard){
  if ('J' in keyboard.keysDown){
    this.velocity.x = -this.speed;
  }

  if ('L' in keyboard.keysDown){
    this.velocity.x = this.speed;
  }

  if ('I' in keyboard.keysDown){
    this.velocity.y = -this.speed;
  }

  if ('K' in keyboard.keysDown){
    this.velocity.y = this.speed;
  }

  if ('.' in keyboard.keysDown){
    this.velocity.z = this.speed
  }

  if (',' in keyboard.keysDown){
    this.velocity.z = -this.speed
  }

  if ('U' in keyboard.keysDown){
    this.orientation -= 0.1
    if (this.orientation < 0) this.orientation = 360
  }

  if ('O' in keyboard.keysDown){
    this.orientation += 0.1
    if (this.orientation > 360) this.orientation = 0
  }
}