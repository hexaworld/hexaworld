var inherits = require('inherits')
var aabb = require('aabb-2d')
var math = require('mathjs')
var transform = require('./transform.js')
var circle = require('./geo/circle.js')
var Entity = require('crtrdg-entity')

module.exports = Player;
inherits(Player, Entity);

function Player(opts){
  this.velocity = opts.velocity
  this.speed = opts.speed
  this.friction = opts.friction
  this.geometry = circle({
    fill: opts.color, 
    stroke: opts.color,
    scale: 2,
    position: opts.position,
    angle: opts.angle,
    children: [
      circle({fill: '#EB8686', stroke: '#EB8686', position: [-0.75, -1], scale: 0.5}), 
      circle({fill: '#EB8686', stroke: '#EB8686', position: [0.75, -1], scale: 0.5})
    ]
  })
}

Player.prototype.move = function(velocity){
  var self = this

  var transform = self.geometry.transform
  self.geometry.move(transform, {invert: true})

  var rad = transform.angle() * Math.PI / 180
  var delta = {}
  delta.position = [
    velocity.position[0] * Math.cos(rad) - velocity.position[1] * Math.sin(rad),
    velocity.position[0] * Math.sin(rad) + velocity.position[1] * Math.cos(rad)
  ]
  delta.angle = velocity.angle
  
  self.geometry.transform.update(delta)
  self.geometry.move(self.geometry.transform)
}

Player.prototype.keyboardInput = function(keyboard){
  if ('E' in keyboard.keysDown){
    this.velocity.position[0] = this.speed;
  }

  if ('Q' in keyboard.keysDown){
    this.velocity.position[0] = -this.speed;
  }

  if ('S' in keyboard.keysDown) {
    this.velocity.position[1] = this.speed;
  }

  if ('W' in keyboard.keysDown) {
    this.velocity.position[1] = -this.speed;
  }

  if ('A' in keyboard.keysDown) {
    this.velocity.angle = -this.speed * 2
  }

  if ('D' in keyboard.keysDown) {
    this.velocity.angle = this.speed * 2
  }
}

Player.prototype.draw = function(context, camera) {
  this.geometry.draw(context, camera, {order: 'bottom'})
}

Player.prototype.dampen = function() {
  this.velocity.position[0] *= this.friction
  this.velocity.position[1] *= this.friction
  this.velocity.angle *= this.friction
}

Player.prototype.position = function() {
  return this.geometry.transform.position()
}

Player.prototype.angle = function() {
  return this.geometry.transform.angle()
}

Player.prototype.scale = function() {
  return this.geometry.transform.scale()
}