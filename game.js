var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');
var Mouse = require('crtrdg-mouse');
var Player = require('./player.js')
var Camera = require('./camera.js')
var World = require('./world.js')

var game = new Game({
  canvas: 'game',
  width: 900,
  height: 500
});

var keyboard = new Keyboard(game)
var mouse = new Mouse(game)
var world = new World()

var player = new Player({
  position: { x: game.width/2, y: game.height/2 },
  size: { x: 10, y: 10 },
  velocity: { x: 0, y: 0 },
  speed: 0,
  friction: 0.9,
  color: '#EB7576'
});

var camera = new Camera({
  position: {x: game.width/2, y:game.height/2, z: 1},
  orientation: 0,
  speed: 2,
  velocity: 0,
  friction: 0.9,
  velocity: { x: 0, y: 0, z: 0}
})


player.addTo(game)
camera.addTo(game)

player.on('update', function(interval) {
  this.keyboardInput(keyboard);
  this.move(this.velocity)
  this.velocity.x *= this.friction;
  this.velocity.y *= this.friction;
  this.checkBoundaries();
});

camera.on('update', function(interval) {
  this.keyboardInput(keyboard)
  this.move(this.velocity)
  this.velocity.x *= this.friction
  this.velocity.y *= this.friction
  this.velocity.z *= this.friction
})

game.on('draw-background', function(context) {
  context.fillStyle = '#F7F7F7'
  context.fillRect(0, 0, game.width, game.height)
})

game.on('update', function(interval){
  // get camera coordinates
  // draw world within those coordinates
  // need a function that renders a world given a camera (zoom, position, orientation)
});


game.on('draw', function(context){
  world.render(context, camera)
  player.render(context, camera)
});

game.on('pause', function(){});

game.on('resume', function(){});
