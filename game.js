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
  position: {x: 0, y: 0},
  rotation: 0,
  size: {x: 2, y: 2},
  velocity: {x: 0, y: 0},
  speed: .5,
  friction: 0.9,
  color: '#EB7576'
});

var camera = new Camera({
  position: {x: 0, y: 0, z: .1},
  rotation: 0,
  speed: .5,
  velocity: 0,
  friction: 0.9,
  velocity: { x: 0, y: 0, z: 0},
  yoked: false
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
  if (camera.yoked){
    camera.position.x = player.position.x 
    camera.position.y = player.position.y
    camera.rotation = player.rotation
  }
  world.render(context, camera)
  player.render(context, camera)
});

game.on('pause', function(){});

game.on('resume', function(){});
