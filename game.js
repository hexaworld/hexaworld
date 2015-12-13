var _ = require('lodash')
var EventEmitter = require('eventemitter2').EventEmitter2
var Game = require('crtrdg-gameloop')
var Keyboard = require('crtrdg-keyboard')
var Time = require('crtrdg-time')
var State = require('./state.js')
var Player = require('./entity/player.js')
var Camera = require('./entity/camera.js')
var World = require('./entity/world.js')
var Ring = require('./entity/ring.js')
var Mask = require('./util/mask.js')

module.exports = function (element, schema, opts) {
  opts = opts || {size: 700}

  var container = document.getElementById(element)

  var main = require('./ui/main.js')(container, opts)
  var score = require('./ui/score.js')(container)
  var stages = require('./ui/stages.js')(container)
  var steps = require('./ui/steps.js')(container)
  var lives = require('./ui/lives.js')(container)

  var state = new State(schema.gameplay)

  var game = new Game({
    canvas: main.canvas,
    width: main.height * 0.7,
    height: main.height * 0.7
  })

  var keyboard = new Keyboard(game)

  var player = new Player(schema.players[0], {
    scale: 2,
    speed: {translation: 1.25, rotation: 8.0},
    friction: 0.9,
    stroke: 'white',
    fill: 'rgb(75,75,75)',
    thickness: 0.5
  })

  var camera = new Camera({
    scale: 130 * 1 / main.height,
    speed: {translation: 0.1, rotation: 0.1, scale: 0.002},
    friction: 0.9,
    yoked: true
  })

  var ring = new Ring(schema.gameplay, {
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
      events.emit([name, tag], _.merge(ret, { time: String(time.seconds()) }))
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

  player.on('exit', function (interval) {
    state.steps.current -= 1
    steps.update(state.steps)
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
          state.score += 10
          score.update(state.score)
          return tile.children[i].children.splice(j, 1)
        }
      })
    })
  })

  game.on('start', function () {})

  var done = false

  game.on('end', function () {
    if (!done) {
      state.score.current += 1000
      score.update(state.score)
      done = true
    }
  })

  function reload (schema) {
    world.reload(schema.tiles)
    player.reload(schema.players[0])
    ring.reload(schema.gameplay)
    state.reload(schema.gameplay)
    score.update(state.score)
    stages.update(state.stages)
    steps.update(state.steps)
    lives.update(state.lives)
  }

  reload(schema)

  game.start()

  return {
    reload: reload,

    pause: function () {
      game.pause()
    },

    resume: function () {
      game.resume()
    },

    events: events
  }
}
