var Game = require('crtrdg-gameloop')
var Keyboard = require('crtrdg-keyboard')
var Time = require('crtrdg-time')
var Player = require('./entity/player.js')
var Camera = require('./entity/camera.js')
var World = require('./entity/world.js')
var Ring = require('./entity/ring.js')
var Mask = require('./util/mask.js')

module.exports = function (canvas, schema, opts) {
  opts = opts || {}

  var game = new Game({
    canvas: canvas,
    width: opts.width,
    height: opts.height
  })

  var keyboard = new Keyboard(game)

  var player = new Player(schema.players[0], {
    scale: 2,
    speed: {translation: 1.0, rotation: 8.0},
    friction: 0.9,
    stroke: 'white',
    fill: 'rgb(75,75,75)',
    thickness: 0.5
  })

  var camera = new Camera({
    scale: 0.125,
    speed: {translation: 0.1, rotation: 0.1, scale: 0.002},
    friction: 0.9,
    yoked: true
  })

  var ring = new Ring({
    size: 0.82 * game.width / 2,
    translation: [game.width / 2, game.width / 2],
    extent: 0.1 * game.width / 2,
    count: 8,
    offset: 3
  })

  var mask = new Mask({
    size: 0.8 * game.width / 2,
    translation: [game.width / 2, game.width / 2],
    fill: 'rgb(90,90,90)'
  })

  var world = new World(schema.tiles, {thickness: 0.4})

  var time = new Time(game)

  player.addTo(game)
  camera.addTo(game)
  world.addTo(game)
  ring.addTo(game)

  keyboard.on('keydown', function (keyCode) {
    if (keyCode === '<space>') {
      if (game.ticker.paused === true) {
        game.resume()
      } else {
        game.pause()
      }
    }
  })

  player.on('update', function (interval) {
    this.move(keyboard, world)
  })

  camera.on('update', function (interval) {
    if (camera.yoked) {
      camera.transform.translation = player.position()
      camera.transform.rotation = player.angle()
    }
    this.move(keyboard)
  })

  ring.on('update', function (interval) {
    this.update(player, world)
  })

  game.on('draw', function (context) {
    mask.set(context)
    world.draw(context, camera)
    player.draw(context, camera)
    mask.unset(context)
    ring.draw(context)
  })

  game.on('update', function (interval) {
    var targets = world.targets()
    if (targets.length > 0 && targets[0].contains(player.position())) {
      console.log('win!')
      console.log(schema.gameplay.timeout - time.seconds())
      ring.flash()
    }
  })

  return {
    reload: function (schema) {
      world.load(schema.tiles)
      player.load(schema.players[0])
    },

    pause: function () {
      game.pause()
    },

    resume: function () {
      game.resume()
    }
  }
}
