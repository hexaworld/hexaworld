var _ = require('lodash')
var color = require('d3-color')
var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');
var Mouse = require('crtrdg-mouse');
var Player = require('./player.js')
var Camera = require('./camera.js')
var World = require('./world.js')
var Ring = require('./ring.js')
var Mask = require('./mask.js')

var game = new Game({
  canvas: 'game',
  width: 650,
  height: 650
});

var keyboard = new Keyboard(game)
var mouse = new Mouse(game)

var player = new Player({
  scale: 2,
  speed: .075,
  friction: 0.9,
  stroke: 'white',
  fill: 'rgb(75,75,75)',
  thickness: 0.5
});

var camera = new Camera({
  scale: 0.1,
  speed: .1,
  friction: 0.9,
  yoked: true
})

var ring = new Ring({
  size: 0.82 * game.width/2,
  position: [game.width/2, game.width/2],
  extent: 0.1 * game.width/2,
  count: 6,
  offset: 3
})

var mask = new Mask({
  size: 0.8 * game.width/2,
  position: [game.width/2, game.width/2]
})

var world = new World({player: player})

player.addTo(game)
camera.addTo(game)
world.addTo(game)
ring.addTo(game)

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

ring.on('update', function(interval) {
  //this.update(colors)
})

world.on('location', function(msg) {
  //console.log(msg)
})

game.on('update', function(interval){

})

game.on('draw', function(context) {
  mask.set(context)
  world.draw(context, camera)
  player.draw(context, camera)
  mask.unset(context)
  ring.draw(context)
})

game.on('pause', function(){})

game.on('resume', function(){})
