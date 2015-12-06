var _ = require('lodash')
var EventEmitter = require('eventemitter2').EventEmitter2
var Game = require('crtrdg-gameloop')
var Keyboard = require('crtrdg-keyboard')
var Time = require('crtrdg-time')
var Player = require('./entity/player.js')
var Camera = require('./entity/camera.js')
var World = require('./entity/world.js')
var Ring = require('./entity/ring.js')
var Mask = require('./util/mask.js')

module.exports = function (element, schema, opts) {
  opts = opts || {size: 700}
  var container = document.getElementById(element)
  var canvas = document.createElement('canvas')
  var height = container.clientHeight || opts.size

  container.style.width = height * 0.7 + 'px'
  container.style.height = height + 'px'
  container.style.position = 'relative'
  container.style.background = 'rgb(55,55,55)'

  canvas.id = 'game'
  canvas.style.marginTop = height * 0.15
  canvas.style.position = 'absolute'
  container.appendChild(canvas)

  var score = require('./ui/score.js')(container)
  var level = require('./ui/level.js')(container, {name: 'playpen'})
  var energy = require('./ui/energy.js')(container)
  var lives = require('./ui/lives.js')(container)

  var scoreVal = 0
  var energyMax = 20
  var energyVal = energyMax

  level.update(1, 2)
  score.update(scoreVal)
  energy.update(10)
  lives.update(3)

  var game = new Game({
    canvas: canvas,
    width: height * 0.7,
    height: height * 0.7
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
    scale: 100 * 1 / height,
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
      events.emit([name, tag], _.merge(ret, { time: (new Date()).toISOString() }))
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
    var playerCoordinates = player.coordinates()
    var tile = world.getTileAtCoordinates(playerCoordinates)
    if (player.moving) energyVal -= 0.015
    energy.update(Math.round(energyVal), energyVal / energyMax)

    var target
    if (tile) {
      target = tile.target()
    }
    if (target && target.contains(player.position())) {
      var cue = tile.cue()
      if (cue && cue.props.fill) {
        ring.startFlashing(['#FFFFFF', '#999999', cue.props.fill, cue.props.fill])
      } else {
        ring.startFlashing(['#FF5050', '#FF8900', '#00C3EE', '#64FF00'])
      }
    }

    tile.children.some(function (child, i) {
      return child.children.some(function (bit, j) {
        if (bit.props.consumable && bit.contains(player.position())) {
          scoreVal += 10
          score.update(scoreVal)
          return tile.children[i].children.splice(j, 1)
        }
      })
    })
  })

  game.on('start', function () {})

  var done = false

  game.on('end', function () {
    ring.startFlashing()
    if (!done) {
      console.log('win!')
      console.log(schema.gameplay.timeout - time.seconds())
      scoreVal = scoreVal + 1000
      score.update(scoreVal)
      done = true
    }
  })

  game.start()

  return {
    reload: function (schema) {
      world.load(schema.tiles)
      player.load(schema.players[0])
      ring.reload()
      scoreVal = 0
      energyVal = energyMax
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
