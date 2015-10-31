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

var player = new Player({
  position: [0, 0],
  angle: 0,
  scale: 1.5,
  velocity: {position: [0, 0], angle: 0},
  speed: .4,
  friction: 0.9,
  color: '#EB7576'
});

var camera = new Camera({
  position: [0, 0],
  angle: 0,
  scale: 0.6,
  velocity: {position: [0, 0], angle: 0},
  speed: .5,
  friction: 0.9,
  yoked: true
})

var world = new World({player: player})

player.addTo(game)
camera.addTo(game)
world.addTo(game)

player.on('update', function(interval) {
  this.keyboardInput(keyboard)
  this.move(this.velocity, world)
  this.dampen()
});

camera.on('update', function(interval) {
  if (camera.yoked) {
    camera.transform.set({
      position: player.position(),
      angle: player.angle()
    })
  }
  this.keyboardInput(keyboard)
  this.move(this.velocity)
  this.dampen()
})

world.on('location', function(msg) {
  //console.log(msg)
})

game.on('draw-background', function(context) {
  context.fillStyle = '#F7F7F7'
  context.fillRect(0, 0, game.width, game.height)
})

game.on('update', function(interval){
  // console.log(world.tiles[1].children[3].contains(player.position()))
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
