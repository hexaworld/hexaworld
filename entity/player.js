var _ = require('lodash')
var inherits = require('inherits')
var transform = require('transformist')
var mouse = require('../geometry/mouse.js')
var Collision = require('../util/collision.js')
var Fixmove = require('../movement/fixmove.js')
var Automove = require('../movement/automove.js')
var Entity = require('crtrdg-entity')

module.exports = Player
inherits(Player, Entity)

function Player (schema, opts) {
  this.opts = opts || {}
  this.reload(schema)
  this.movement = {}
  this.movement.center = new Fixmove({speed: opts.speed})
  this.movement.tile = new Automove({
    keymap: ['A', 'D', 'W', '<left>', '<right>', '<up>'],
    heading: [-60, 60, 0, -60, 60, 0],
    shift: [0, 0, 8, 0, 0, 8],
    speed: opts.speed
  })
  this.movement.path = new Automove({
    keymap: [],
    heading: [],
    shift: [],
    speed: opts.speed
  })
  this.movement.deadend = new Automove({
    keymap: [],
    heading: [],
    shift: [],
    speed: {translation: -opts.speed.translation, rotation: opts.speed.rotation}
  })
  this.collision = new Collision()
  this.waiting = true
  this.reversing = false
  this.inside = false
  this.moving = true
}

Player.prototype.reload = function (schema) {
  var self = this
  var translation = [
    50 * 3 / 2 * schema.translation[0],
    50 * Math.sqrt(3) * (schema.translation[1] + schema.translation[0] / 2)
  ]
  var rotation = schema.rotation
  if (schema.character === 'mouse') {
    self.geometry = mouse({
      translation: translation,
      rotation: rotation,
      fill: self.opts.fill,
      stroke: self.opts.stroke,
      scale: self.opts.scale,
      thickness: self.opts.thickness
    })
  }
}

Player.prototype.moveto = function(coordinate) {
  var translation = [
    50 * 3 / 2 * coordinate[0],
    50 * Math.sqrt(3) * (coordinate[1] + coordinate[0] / 2)
  ]
  this.geometry.unstage()
  this.geometry.transform.translation = translation
  this.geometry.stage()
}

Player.prototype.move = function (keyboard, world) {
  var self = this
  
  var tile = world.getTileAtCoordinates(this.coordinates())
  var current = self.geometry.transform

  var trigger = _.find(tile.children, function (child) { return child.props.trigger })
  var inside = trigger.contains(current.translation)
  var keys = keyboard.keysDown

  if (inside && !self.inside) {
    self.emit('enter', { tile: tile.transform.translation, position: self.geometry.transform })
    self.inside = true
  } else if (!inside && self.inside) {
    self.emit('exit', { tile: tile.transform.translation, position: self.geometry.transform })
    self.inside = false
  }

  var delta
  var correction

  if (inside) {
    self.moving = false
    self.movement.deadend.reset()
    self.reversing = false

    if (self.movement.tile.keypress(keys)) self.waiting = false
    if (self.waiting) {
      var center = {
        translation: tile.transform.translation
      }
      delta = self.movement.center.compute(current, center)
    } else {
      delta = self.movement.tile.compute(keys, current, tile.transform)
    }

    self.geometry.update(delta)
    correction = self.collision.handle(world, self.geometry, delta)

    if (correction) {
      self.geometry.update(correction)
      self.waiting = true
      self.movement.tile.reset()
    }
  } else {
    self.waiting = true
    self.moving = true
    self.movement.tile.reset()

    delta = self.movement.path.compute(keys, current)
    correction = self.collision.handle(world, self.geometry, delta)

    if (correction && !self.reversing) {
      self.reversing = true
      self.geometry.update(correction)
    }

    if (self.reversing) {
      delta = self.movement.deadend.compute(keys, current)
      self.geometry.update(delta)
    } else {
      self.geometry.update(delta)
    }
  }
}

Player.prototype.draw = function (context, camera) {
  this.geometry.draw(context, camera, {order: 'bottom'})
}

Player.prototype.position = function () {
  return this.geometry.transform.translation
}

Player.prototype.coordinates = function () {
  var position = this.position()
  var tileScale = 50
  var x = position[0] / 3 / tileScale * 2
  var y = (position[1] - tileScale * Math.sqrt(3) * x / 2) / (tileScale * Math.sqrt(3))
  return [Math.round(x), Math.round(y)]
}

Player.prototype.angle = function () {
  return this.geometry.transform.rotation
}
