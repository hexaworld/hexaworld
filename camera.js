var inherits = require('inherits');
var aabb = require('aabb-2d');
var Entity = require('crtrdg-entity');
var Transform = require('./transform.js')

module.exports = Camera;
inherits(Camera, Entity);

function Camera(options){
  var self = this
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
  this.transform = new Transform({
    position: {x: -self.position.x, y: -self.position.y}, 
    scale: self.position.z,
    rotation: self.orientation
  })
}

Camera.prototype.move = function(velocity) {
  var self = this
  this.position.x += velocity.x
  this.position.y += velocity.y
  this.position.z += velocity.z * 0.1
  this.transform.update({
    position: {x: -self.position.x +this.game.width/2, y: -self.position.y +this.game.height/2}, 
    scale: self.position.z, 
    rotation: self.orientation})
  console.log(this.transform.position)
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