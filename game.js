var _ = require('lodash')
var EventEmitter = require('eventemitter2').EventEmitter2
var Game = require('crtrdg-gameloop')
var Keyboard = require('crtrdg-keyboard')
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

  var player = new Player({
    character: schema.players[0].character,
    translation: schema.players[0].translation,
    scale: 2,
    speed: {translation: 1, rotation: 8},
    friction: 0.9,
    stroke: 'white',
    fill: 'rgb(75,75,75)',
    thickness: 0.5
  })

  var camera = new Camera({
    scale: 0.1,
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

  var world = new World(schema.tiles, {thickness: 0.25})

  var events = new EventEmitter({
    wildcard: true
  })
  function relay (emitter, name, tag) {
    emitter.on(tag, function (value) {
      // emit namespaced events
      events.emit([name, tag], value)
    })
  }
  relay(player, 'player', 'move')
  relay(camera, 'camera', 'move')

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
      camera.transform.translation = player.geometry.transform.translation
      camera.transform.rotation = player.geometry.transform.rotation
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

  return {
    reload: function (schema) {
      world = new World(schema, {thickness: 0.25})
    },

    pause: function () {
      game.pause()
    },

    resume: function () {
      game.resume()
    },

    events: events
  }
}
