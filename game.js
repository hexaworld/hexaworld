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
  console.log(height)
  container.style.width = height * 0.7 + 'px'
  container.style.height = height + 'px'
  container.style.position = 'relative'

  canvas.id = 'game'
  canvas.style.marginTop = height * 0.15
  canvas.style.position = 'absolute'
  container.appendChild(canvas)

  var score = require('./ui/score.js')(container)
  var level = require('./ui/level.js')(container, {name: 'playpen'})
  var energy = require('./ui/energy.js')(container)
  var lives = require('./ui/lives.js')(container)

  level.update(1, 2)
  score.update(100)
  energy.update(90)
  lives.update(2)

  var game = new Game({
    canvas: canvas,
    width: height * 0.7,
    height: height * 0.7
  })

  var keyboard = new Keyboard(game)

  var player = new Player(schema.players[0], {
    scale: 2,
    speed: {translation: 0.5, rotation: 8.0},
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
      ring.startFlashing()
    }

    var position = player.position()
    var tile = world.tiles[world.locate(position)]

    tile.children.forEach(function (child, i) {
      child.children.forEach(function (bit, j) {
        if (bit.props.consumable) {
          if (bit.contains(position)) {
            tile.children[i].children.splice(j, 1)
          }
        }
      })
    })
  })

  game.on('start', function () {})

  game.on('end', function () {})

  game.start()

  return {
    reload: function (schema) {
      world.load(schema.tiles)
      player.load(schema.players[0])
      ring.reload()
    },

    pause: function () {
      game.pause()
    },

    resume: function () {
      game.resume()
    }
  }
}
