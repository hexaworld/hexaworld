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
  position: [0, 0],
  velocity: [0, 0],
  angle: 0,
  scale: 1.5,
  speed: .5,
  friction: 0.9,
  color: '#EB7576'
});

var camera = new Camera({
  position: {x: 0, y: 0, z: .6},
  rotation: 0,
  speed: .5,
  velocity: 0,
  friction: 0.9,
  velocity: { x: 0, y: 0, z: 0},
  yoked: true
})

player.addTo(game)
camera.addTo(game)

player.on('update', function(interval) {
  this.keyboardInput(keyboard)
  this.move(this.velocity)
  this.velocity[0] *= this.friction
  this.velocity[1] *= this.friction
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
  if (camera.yoked){
    camera.position.x = player.position[0]
    camera.position.y = player.position[1]
    camera.rotation = player.angle
  }
  // get camera coordinates
  // draw world within those coordinates
  // need a function that renders a world given a camera (zoom, position, orientation)
});


game.on('draw', function(context) {
  world.draw(context, camera)
  player.draw(context, camera)
})

game.on('pause', function(){});

game.on('resume', function(){});
