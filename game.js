var _ = require('lodash')
var EventEmitter = require('eventemitter2').EventEmitter2
var Game = require('crtrdg-gameloop')
var Keyboard = require('crtrdg-keyboard')
var Player = require('./entity/player.js')
var Camera = require('./entity/camera.js')
var World = require('./entity/world.js')
var Ring = require('./entity/ring.js')
var Mask = require('./util/mask.js')
var formatEvent = require('./util/events.js').formatEvent

module.exports = function (canvas, schema, opts) {
  opts = opts || {size: 700}

  if (_.isString(canvas)) {
    var container = document.getElementById(canvas)
    canvas = require('./ui/main.js')(container, opts).canvas
  }

  var height = canvas.clientHeight

  var game = new Game({
    canvas: canvas,
    width: height * 1.15,
    height: height
  })

  var keyboard = new Keyboard(game)

  var player = new Player({
    scale: 2.25,
    translation: [0, 0],
    rotation: 0,
    character: 'mouse',
    speed: {translation: 1.25, rotation: 8.0},
    friction: 0.9,
    stroke: 'white',
    fill: 'white',
    thickness: 0.5
  })

  var camera = new Camera({
    scale: 150 * 1 / height * 0.7,
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

  var events = new EventEmitter({
    wildcard: true
  })

  function relay (emitter, name, tag) {
    var emit = function (tag, value) {
      value = value || {}
      var ret = value
      if (typeof ret === 'string') {
        ret = { value: ret }
      }
      events.emit([name, tag], formatEvent(ret))
    }
    if (!tag) {
      emitter.onAny(function (value) {
        emit(this.event, value)
      })
    } else {
      emitter.on(tag, function (value) {
        emit(tag, value)
      })
    }
  }

  relay(player, 'player', 'enter')
  relay(player, 'player', 'exit')
  relay(player, 'player', 'collect')
  relay(keyboard, 'keyboard', 'keyup')
  relay(keyboard, 'keyboard', 'keydown')
  relay(game, 'game', 'start')
  relay(game, 'game', 'end')

  player.addTo(game)
  camera.addTo(game)
  world.addTo(game)
  ring.addTo(game)

  keyboard.on('keydown', function (keyCode) {
    if (keyCode === '<space>') {
      if (game.paused === true) {
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
      var rad = player.angle() * Math.PI / 180
      var d = [
        Math.cos(rad) * 0 + Math.sin(rad) * 40, 
        Math.sin(rad) * 0 - Math.cos(rad) * 40
      ]
      camera.transform.compose({translation: d})
    }
    this.move(keyboard)
  })

  ring.on('update', function (interval) {
    this.update(player, world)
  })

  game.on('draw', function (context) {
    //mask.set(context)
    world.draw(context, camera)
    player.draw(context, camera)
    //mask.unset(context)
    //ring.draw(context)
  })

  game.on('update', function (interval) {
    var coordinates = player.coordinates()
    var tile = world.gettile(coordinates)

    tile.children.some(function (child, i) {
      return child.children.some(function (bit, j) {
        if (bit.props.consumable && bit.contains(player.position())) {
          player.emit('collect')
          return tile.children[i].children.splice(j, 1)
        }
      })
    })
  })

  function reload (schema) {
    world.reload(schema.tiles)
    player.moveto(schema.start[0])
    ring.stopFlashing()
  }

  reload(schema)

  return {
    reload: reload,

    pause: function () {
      game.pause()
    },

    resume: function () {
      game.resume()
    },

    start: function () {
      game.start()
    },

    moveto: function (transform) {
      player.moveto(transform)
    },

    flash: function () {
      ring.startFlashing(schema.flash)
    },

    events: events
  }
}
