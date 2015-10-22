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
};

Player.prototype.checkBoundaries = function(){
  if (this.position.x <= 0){
    this.position.x = 0;
  }

  if (this.position.x >= this.game.width - this.size.x){
    this.position.x = this.game.width - this.size.x;
  }

  if (this.position.y <= 0){
    this.position.y = 0;
  }

  if (this.position.y >= this.game.height - this.size.y){
    this.position.y = this.game.height - this.size.y;
  }
};

Player.prototype.keyboardInput = function(keyboard){
  if ('L' in keyboard.keysDown){
    this.velocity.x = this.speed;
  }

  if ('J' in keyboard.keysDown){
    this.velocity.x = -this.speed;
  }

  if ('K' in keyboard.keysDown){
    this.velocity.y = this.speed;
  }

  if ('I' in keyboard.keysDown){
    this.velocity.y = -this.speed;
  }

  if ('U' in keyboard.keysDown){
    this.orientation -= 0.7
    if (this.orientation < 0) this.orientation = 360
  }

  if ('O' in keyboard.keysDown){
    this.orientation += 0.7
    if (this.orientation > 360) this.orientation = 0
  }
}

Player.prototype.render = function(context, camera) {

  var self = this
  var angle = self.orientation * Math.PI / 180
    
  context.lineWidth = 3

  // ears
  var x = -5
  var y = -10
  var dx = x*Math.cos(angle)-y*Math.sin(angle)
  var dy = x*Math.sin(angle)+y*Math.cos(angle)
  context.beginPath()
  context.fillStyle = '#EB8686'
  context.ellipse(self.position.x + dx, self.position.y + dy, 13, 6, angle + 45* Math.PI/180, 0, 2*Math.PI)
  context.closePath()
  context.fill()

  var x = 5
  var y = -10
  var dx = x*Math.cos(angle)-y*Math.sin(angle)
  var dy = x*Math.sin(angle)+y*Math.cos(angle)
  context.beginPath()
  context.fillStyle = '#EB8686'
  context.ellipse(self.position.x + dx, self.position.y + dy, 13, 6, angle - 45 * Math.PI/180, 0, 2*Math.PI)
  context.closePath()
  context.fill()

  // body
  context.beginPath() 
  context.fillStyle = '#EC6A6A'
  context.arc(self.position.x, self.position.y, 15, 0, 2*Math.PI)
  context.closePath()
  context.fill()

}