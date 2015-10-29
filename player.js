var inherits = require('inherits')
var aabb = require('aabb-2d')
var math = require('mathjs')
var circle = require('./geo/circle.js')
var Entity = require('crtrdg-entity')

module.exports = Player;
inherits(Player, Entity);

function Player(opts){
  this.position = opts.position
  this.scale = opts.scale
  this.angle = opts.angle
  this.velocity = opts.velocity
  this.speed = opts.speed
  this.friction = opts.friction
  this.geometry = circle({
    fill: opts.color, 
    stroke: opts.color,
    scale: 2,
    moveable: true,
    children: [
      circle({fill: '#EB8686', stroke: '#EB8686', position: [-0.75, -1], scale: 0.5, moveable: true}), 
      circle({fill: '#EB8686', stroke: '#EB8686', position: [0.75, -1], scale: 0.5, moveable: true})
    ]
  })
}

Player.prototype.move = function(velocity){
  var self = this
  var angle = this.angle * Math.PI / 180
  this.position[0] += velocity[0] * Math.cos(angle) - velocity[1] * Math.sin(angle)
  this.position[1] += velocity[0] * Math.sin(angle) + velocity[1] * Math.cos(angle)
  this.geometry.transform.set({
    position: self.position,
    scale: self.scale, 
    angle: self.angle})
}

Player.prototype.keyboardInput = function(keyboard){
  if ('E' in keyboard.keysDown){
    this.velocity[0] = this.speed;
  }

  if ('Q' in keyboard.keysDown){
    this.velocity[0] = -this.speed;
  }

  if ('S' in keyboard.keysDown){
    this.velocity[1] = this.speed;
  }

  if ('W' in keyboard.keysDown){
    this.velocity[1] = -this.speed;
  }

  if ('A' in keyboard.keysDown){
    this.angle -= this.speed*1.9
    if (this.angle < 0) this.angle = 360
  }

  if ('D' in keyboard.keysDown){
    this.angle += this.speed*1.9
    if (this.angle > 360) this.angle = 0
  }
}

Player.prototype.draw = function(context, camera) {

  this.geometry.draw(context, camera)

//   var self = this
//   var angle = camera.rotation * Math.PI / 180
//   var scale = 1/camera.transform.scale()
// //  var position = [self.position.x*scale, self.position.y*scale]
//   var position = [self.position.x, self.position.y]
//   var rotation = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]] 

//   position[0] = position[0] - camera.position.x
//   position[1] = position[1] - camera.position.y
//   var position = math.multiply(position, rotation)

//   var originX = scale*position[0] + game.width/2
//   var originY = scale*position[1] + 2*game.height/4

// //  var originX = position[0] - camera.position.x+game.width/2
// //  var originY = position[1] - camera.position.y+game.height/2
  
//   angle = self.rotation * Math.PI / 180 - angle

//   context.lineWidth = 3

//   // ears
//   var x = -this.size.x/2
//   var y = -this.size.y
//   var dx = x*Math.cos(angle)-y*Math.sin(angle)
//   var dy = x*Math.sin(angle)+y*Math.cos(angle)
//   context.beginPath()
//   context.fillStyle = '#EB8686'
//   context.ellipse(originX + scale*dx, originY + scale*dy, scale*this.size.x*1.3, scale*this.size.x*.6, angle + 45* Math.PI/180, 0, 2*Math.PI)
//   context.closePath()
//   context.fill()

//   var x = this.size.x/2
//   var y = -this.size.y
//   var dx = x*Math.cos(angle)-y*Math.sin(angle)
//   var dy = x*Math.sin(angle)+y*Math.cos(angle)
//   context.beginPath()
//   context.fillStyle = '#EB8686'
//   context.ellipse(originX + scale*dx, originY + scale*dy, scale*this.size.x*1.3, scale*this.size.x*.6, angle - 45 * Math.PI/180, 0, 2*Math.PI)
//   context.closePath()
//   context.fill()

//   // body
//   context.beginPath() 
//   context.fillStyle = '#EC6A6A'
//   context.arc(originX, originY, scale*this.size.x*1.5, 0, 2*Math.PI)
//   context.closePath()
//   context.fill()

}