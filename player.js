var inherits = require('inherits');
var aabb = require('aabb-2d');
var Entity = require('crtrdg-entity');

module.exports = Player;
inherits(Player, Entity);

// add the camera position, subtract the center, rotate, add center

function Player(options){
  this.position = { 
    x: options.position.x, 
    y: options.position.y 
  };

  this.size = {
    x: options.size.x,
    y: options.size.y
  };

  this.orientation = options.orientation

  this.velocity = {
    x: options.velocity.x,
    y: options.velocity.y
  };

  this.boundingBox = aabb([this.position.x, this.position.y], [this.size.x, this.size.y]);

  this.on('update', function(interval){
    this.boundingBox = aabb([this.position.x, this.position.y], [this.size.x, this.size.y]);
  });
  
  this.speed = options.speed;
  this.friction = options.friction;
  this.color = options.color
}

Player.prototype.move = function(velocity){
  var angle = this.orientation * Math.PI / 180
  this.position.x += velocity.x*Math.cos(angle)-velocity.y*Math.sin(angle);
  this.position.y += velocity.x*Math.sin(angle)+velocity.y*Math.cos(angle);
//  this.position.x += velocity.x;
//  this.position.y += velocity.y;
};

Player.prototype.checkBoundaries = function(){
  if (this.position.x <= -this.game.width/2* + this.size.x){
    this.position.x = -this.game.width/2 + this.size.x;
  }

  if (this.position.x >= this.game.width/2 - this.size.x){
    this.position.x = this.game.width/2 - this.size.x;
  }

  if (this.position.y <= -this.game.height/2 + this.size.y){
    this.position.y = -this.game.height/2 + this.size.y;
  }

  if (this.position.y >= this.game.height/2 - this.size.y){
    this.position.y = this.game.height/2 - this.size.y;
  }
};

Player.prototype.keyboardInput = function(keyboard){
  if ('O' in keyboard.keysDown){
    this.velocity.x = this.speed;
  }

  if ('U' in keyboard.keysDown){
    this.velocity.x = -this.speed;
  }

  if ('K' in keyboard.keysDown){
    this.velocity.y = this.speed;
  }

  if ('I' in keyboard.keysDown){
    this.velocity.y = -this.speed;
  }

  if ('J' in keyboard.keysDown){
    this.orientation -= 0.8
    if (this.orientation < 0) this.orientation = 360
  }

  if ('L' in keyboard.keysDown){
    this.orientation += 0.8
    if (this.orientation > 360) this.orientation = 0
  }
}

Player.prototype.render = function(context, camera) {

  var self = this
  var angle = camera.orientation * Math.PI / 180
  var scale = 0.1 * camera.position.z
  var position = [self.position.x, self.position.y]
  var rotation = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]] 

  position[0] = position[0] - camera.position.x
  position[1] = position[1] - camera.position.y
  var position = math.multiply(position, rotation)

  var originX = position[0] + game.width/2
  var originY = position[1] + game.height/2

//  var originX = position[0] - camera.position.x+game.width/2
//  var originY = position[1] - camera.position.y+game.height/2
  
  angle = self.orientation * Math.PI / 180 - angle

  context.lineWidth = 3

  // ears
  var x = -this.size.x/2
  var y = -this.size.y
  var dx = x*Math.cos(angle)-y*Math.sin(angle)
  var dy = x*Math.sin(angle)+y*Math.cos(angle)
  context.beginPath()
  context.fillStyle = '#EB8686'
  context.ellipse(originX + scale*dx, originY + scale*dy, scale*this.size.x*1.3, scale*this.size.x*.6, angle + 45* Math.PI/180, 0, 2*Math.PI)
  context.closePath()
  context.fill()

  var x = this.size.x/2
  var y = -this.size.y
  var dx = x*Math.cos(angle)-y*Math.sin(angle)
  var dy = x*Math.sin(angle)+y*Math.cos(angle)
  context.beginPath()
  context.fillStyle = '#EB8686'
  context.ellipse(originX + scale*dx, originY + scale*dy, scale*this.size.x*1.3, scale*this.size.x*.6, angle - 45 * Math.PI/180, 0, 2*Math.PI)
  context.closePath()
  context.fill()

  // body
  context.beginPath() 
  context.fillStyle = '#EC6A6A'
  context.arc(originX, originY, scale*this.size.x*1.5, 0, 2*Math.PI)
  context.closePath()
  context.fill()

}