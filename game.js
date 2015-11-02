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
  scale: 2,
  speed: .075,
  friction: 0.9,
  stroke: 'white',
  fill: 'rgb(75,75,75)',
  thickness: 0.75
});

var camera = new Camera({
  scale: 0.1,
  speed: .1,
  friction: 0.9,
  yoked: true
})

var world = new World({player: player})

player.addTo(game)
camera.addTo(game)
world.addTo(game)

player.on('update', function(interval) {
  this.move(keyboard, world)
});

camera.on('update', function(interval) {
  if (camera.yoked) {
    camera.transform.set({
      position: player.position(),
      angle: player.angle()
    })
  }
  this.move(keyboard)
})

world.on('location', function(msg) {
  //console.log(msg)
})

game.on('draw-background', function(context) {
  context.fillStyle = 'rgb(90,90,90)',
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

game.on('pause', function(){})

game.on('resume', function(){})
