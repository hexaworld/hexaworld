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
  speed: {position: .75, angle: 8},
  friction: 0.9,
  stroke: 'white',
  fill: 'rgb(75,75,75)',
  thickness: 0.5
});

var camera = new Camera({
  scale: 0.1,
  speed: {position: .1, angle: .1, scale: .002},
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

keyboard.on('keydown', function(keyCode){
  if (keyCode == '<space>'){
    if (game.ticker.paused == true){
      game.resume();
    } else {
      game.pause();
    }
  }
});

player.on('update', function(interval) {
  //this.move(keyboard, world)
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
  //  var colors = _.range(30).map(function (i) {
//    var r = Math.sqrt(Math.pow(player.position()[0], 2) + Math.pow(player.position()[1], 2)) / 100
//    var c = color.hsl(player.angle(), 0.5, Math.max(1 - Math.max(r - 0.25, 0) - 0.35, 0))
//    return c.toString()
//  })
  var r = Math.sqrt(Math.pow(player.position()[0], 2) + Math.pow(player.position()[1], 2)) / 100
  var worldAngle = 180/Math.PI*Math.atan2(player.position()[1],player.position()[0])
  var a = player.angle() % 360
  if (a < 0) a += 360
  if (worldAngle < 0) worldAngle += 360
  worldAngle = worldAngle - 90
  if (worldAngle < 0) worldAngle += 360
  var w = Math.min(60/r*(Math.sqrt(3)/2)/2, 360)
  var c = color.hsl(100, 0.5, Math.max(1 - Math.max(r/1.5 - 0.25, 0) - 0.35, 0))
  //var c = '#64FF00'

  console.log(a)
  console.log(worldAngle)

  var colors = _.range(30).map(function (i) {
    angle = (-worldAngle + a +  (i*360/30))
    if (angle > 180) angle = 360 - angle
  
  if (Math.abs(angle) <= w/2 & r > .01 & r < 0.75*1.5) {
    return c.toString()
  } else if (r <= .01) {
    c = color.hsl(100, 0.5, Math.max(1 - Math.max(.01/1.5 - 0.25, 0) - 0.35, 0))
    return c.toString()
    } else {
    return 'rgb(55,55,55)'
  }
  })
  this.update(colors)
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
