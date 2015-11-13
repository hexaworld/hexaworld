var _ = require('lodash')
var inherits = require('inherits')
var aabb = require('aabb-2d')
var math = require('mathjs')
var transform = require('./transform.js')
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
  this.movement.center = new Fixmove()
  this.movement.tile = new Automove({
    keymap: ['Q', 'W', 'E', 'A', 'S', 'D'],
    heading: [-60, 0, 60, -120, -180, 120],
    shift: 8
  })
  this.movement.path = new Automove({
    keymap: ['S'], 
    heading: [-180]
  })
  this.collision = new Collision()
  this.waiting = true
}

Player.prototype.move = function(keyboard, world) {
  var self = this

  var current = self.geometry.transform
  var tile = world.tiles[world.locate(self.position())]
  var inside =  tile.children[0].contains(current.position())


  var delta
  if (inside) {
    var keysDown = keyboard.keysDown
    if (self.movement.tile.keypress(keysDown)) self.waiting = false
    if (self.waiting) {
      delta = self.movement.center.compute(current, {position: [tile.transform.position()[0], tile.transform.position()[1]]})
    } else {
      delta = self.movement.tile.compute(keysDown, current, tile.transform)
    }
  } else {
    self.waiting = true
    delta = self.movement.path.compute(keyboard.keysDown, current)
  }

  self.geometry.update(delta)
  self.collision.handle(world, self.geometry, delta)
}

Player.prototype.draw = function(context, camera) {
  this.geometry.draw(context, camera, {order: 'bottom'})
}

Player.prototype.position = function() {
  return this.geometry.transform.position()
}

Player.prototype.angle = function() {
  return this.geometry.transform.angle()
}

Player.prototype.scale = function() {
  return this.geometry.transform.scale()
}
