var _ = require('lodash')
var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');
var Mouse = require('crtrdg-mouse');
var Player = require('./player.js')
var Camera = require('./camera.js')
var World = require('./world.js')

var game = new Game({
  canvas: 'game',
  width: 600,
  height: 600
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
  context.save()
  context.beginPath()
  context.moveTo(0, 0)
  _.range(7).map(function(i) {
    var dx =  (Math.cos(i * 2 * Math.PI / 6) + 1) * game.width / 2
    var dy =  (Math.sin(i * 2 * Math.PI / 6) + 1) * game.height / 2
    context.lineTo(dx, dy)
  })
  context.fillStyle = 'rgb(90,90,90)'
  context.fill()
  context.clip()
})

game.on('update', function(interval){

})


game.on('draw', function(context) {
  world.draw(context, camera)
  player.draw(context, camera)
  context.restore()
})

game.on('pause', function(){})

game.on('resume', function(){})
