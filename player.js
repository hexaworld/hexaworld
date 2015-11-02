var _ = require('lodash')
var inherits = require('inherits')
var aabb = require('aabb-2d')
var math = require('mathjs')
var transform = require('./transform.js')
var circle = require('./geo/circle.js')
var Movement = require('./movement.js')
var Entity = require('crtrdg-entity')

module.exports = Player;
inherits(Player, Entity);

function Player(opts){
  this.geometry = circle({
    fill: opts.fill, 
    stroke: opts.stroke,
    scale: opts.scale,
    thickness: opts.thickness,
    children: [
      circle({fill: opts.fill, stroke: opts.stroke, thickness: opts.thickness, position: [-0.7, -.9], scale: 0.6, angle: -45, aspect: 0.6}), 
      circle({fill: opts.fill, stroke: opts.stroke, thickness: opts.thickness, position: [0.7, -.9], scale: 0.6, angle: 45, aspect: 0.6})
    ]
  })
  this.movement = new Movement({
    speed: opts.speed,
    friction: opts.friction,
    keymap: {position: [['E','Q'],['S','W']], angle: ['D','A']}
  })
}

Player.prototype.move = function(keyboard, world) {
  var self = this

  var delta = self.movement.compute(keyboard.keysDown, self.geometry.transform.angle())

  self.geometry.unstage()
  self.geometry.transform.compose(delta)
  self.geometry.stage(self.geometry.transform)

  var collisions = world.intersects(self.geometry) 
  if (collisions) {
    var ind = _.indexOf(collisions, _.max(collisions, function (i) {return i.response.overlap}))
    var correction = {
      position: [
        -0.2 * delta.position[0] + 0.5 * collisions[ind].response.overlapV.x, 
        -0.2 * delta.position[1] + 0.5 * collisions[ind].response.overlapV.y, 
      ]
    }
    self.geometry.unstage()
    self.geometry.transform.compose(correction)
    self.geometry.stage(self.geometry.transform)
  }
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
