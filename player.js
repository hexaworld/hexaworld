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
  this.position.x += velocity.x;
  this.position.y += velocity.y;
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
}

Player.prototype.render = function(context, camera) {

  var self = this

  context.lineWidth = 3

  // ears
  context.beginPath()
  context.fillStyle = '#EB8686'
  context.ellipse(self.position.x - 5, self.position.y - 10, 13, 6, 45 * Math.PI/180, 0, 2*Math.PI)
  context.closePath()
  context.fill()

  context.beginPath()
  context.fillStyle = '#EB8686'
  context.ellipse(self.position.x + 5, self.position.y - 10, 13, 6, -45 * Math.PI/180, 0, 2*Math.PI)
  context.closePath()
  context.fill()

  // body
  context.beginPath() 
  context.fillStyle = '#EC6A6A'
  context.arc(self.position.x, self.position.y, 15, 0, 2*Math.PI)
  context.closePath()
  context.fill()

}