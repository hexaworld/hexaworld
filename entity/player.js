var inherits = require('inherits')
var mouse = require('../geometry/mouse.js')
var Collision = require('../util/collision.js')
var Fixmove = require('../movement/fixmove.js')
var Automove = require('../movement/automove.js')
var Entity = require('crtrdg-entity')

module.exports = Player
inherits(Player, Entity)

function Player (schema, opts) {
  this.opts = opts || {}
  this.load(schema)
  this.movement = {}
  this.movement.center = new Fixmove({speed: opts.speed})
  this.movement.tile = new Automove({
    keymap: ['A', 'D', 'W', '<left>', '<right>', '<up>'],
    heading: [-60, 60, 0, -60, 60, 0],
    shift: [0, 0, 8, 0, 0, 8],
    speed: opts.speed
  })
  this.movement.path = new Automove({
    keymap: ['W', 'S', 'A', 'D', '<up>', '<down>', '<left>', '<right>'],
    heading: [0, 0, -180, 180, 0, 0, -180, 180],
    shift: [1, -1, 2, 2, 1, -1, 2, 2],
    speed: {translation: opts.speed.translation, rotation: opts.speed.rotation*.8}
  })
  this.collision = new Collision()
  this.waiting = true
}

Player.prototype.load = function (schema) {
  var self = this
  var translation = [
    50 * 3 / 2 * schema.translation[0],
    50 * Math.sqrt(3) * (schema.translation[1] + schema.translation[0] / 2)
  ]
  if (schema.character === 'mouse') {
    self.geometry = mouse({
      translation: translation,
      fill: self.opts.fill,
      stroke: self.opts.stroke,
      scale: self.opts.scale,
      thickness: self.opts.thickness
    })
  }
}

Player.prototype.move = function (keyboard, world) {
  var self = this

  var current = self.geometry.transform
  var tile = world.tiles[world.locate(current.translation)]
  var inside = tile.children[0].contains(current.translation)
  var keys = keyboard.keysDown

  var delta
  if (inside) {
    if (self.movement.tile.keypress(keys)) self.waiting = false
    if (self.waiting) {
      var center = {
        translation: [tile.transform.translation[0], tile.transform.translation[1]]
      }
      delta = self.movement.center.compute(current, center)
    } else {
      delta = self.movement.tile.compute(keys, current, tile.transform)
    }
    self.movement.path.reset()
    self.movement.path.clear()
  } else {
    self.waiting = true
    self.movement.tile.reset()
    delta = self.movement.path.compute(keys, current)
  }

  self.geometry.update(delta)
  var collide = self.collision.handle(world, self.geometry, delta)
  
  if (collide & inside) {
    self.waiting = true
    var current = self.geometry.transform
    var center = {
      position: [tile.transform.translation[0], tile.transform.translation[1]]
    }
    delta = self.movement.center.compute(current, center)
    self.geometry.update(delta)
    self.movement.tile.reset()
  }
}

Player.prototype.draw = function (context, camera) {
  this.geometry.draw(context, camera, {order: 'bottom'})
}

Player.prototype.position = function () {
  return this.geometry.transform.translation
}

Player.prototype.angle = function () {
  return this.geometry.transform.rotation
}
