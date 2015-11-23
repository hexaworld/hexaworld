var _ = require('lodash')
var inherits = require('inherits')
var aabb = require('aabb-2d')
var math = require('mathjs')
var circle = require('./geo/circle.js')
var Collision = require('./collision.js')
var Fixmove = require('./fixmove.js')
var Automove = require('./automove.js')
var Freemove = require('./freemove.js')
var Entity = require('crtrdg-entity')

module.exports = Player;
inherits(Player, Entity);

function Player(opts){
  this.geometry = circle({
    position: opts.position,
    angle: opts.angle,
    fill: opts.fill, 
    stroke: opts.stroke,
    scale: opts.scale,
    thickness: opts.thickness,
    children: [
      circle({fill: opts.fill, stroke: opts.stroke, thickness: opts.thickness, 
        position: [-0.7, -.9], scale: 0.6, angle: -45, aspect: 0.6}), 
      circle({fill: opts.fill, stroke: opts.stroke, thickness: opts.thickness, 
        position: [0.7, -.9], scale: 0.6, angle: 45, aspect: 0.6})
    ]
  })
  this.movement = {}
  this.movement.center = new Fixmove({speed: opts.speed})
  this.movement.tile = new Automove({
    keymap: ['A', 'D', 'W', '<left>', '<right>', '<up>'],
    heading: [-60, 60, 0, -60, 60, 0],
    shift: [0, 0, 8, 0, 0, 8],
    speed: opts.speed
  })
  this.movement.path = new Automove({
    keymap: ['W', 'S', '<up>', '<down>'], 
    heading: [0, 0, 0, 0],
    shift: [1, -1, 1, -1],
    speed: opts.speed
  })
  this.collision = new Collision()
  this.waiting = true
  this.update()
}

Player.prototype.move = function(keyboard, world) {
  var self = this

  var current = self.geometry.transform
  var tile = world.tiles[world.locate(self.position)]
  var inside =  tile.children[0].contains(current.position)
  var keys = keyboard.keysDown

  var delta
  if (inside) {
    if (self.movement.tile.keypress(keys)) self.waiting = false
    if (self.waiting) {
      var center = {
        position: [tile.transform.position[0], tile.transform.position[1]]
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
  self.collision.handle(world, self.geometry, delta)
  self.position = self.geometry.transform.position
  self.update()
}

Player.prototype.draw = function(context, camera) {
  this.geometry.draw(context, camera, {order: 'bottom'})
}

Player.prototype.update = function() {
  this.position = this.geometry.transform.position
  this.angle = this.geometry.transform.angle
  this.scale = this.geometry.transform.scale
}