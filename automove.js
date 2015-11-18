var _ = require('lodash')
var inherits = require('inherits')
var transform = require('./transform.js')
var Fixmove = require('./fixmove.js')

module.exports = Automove
inherits(Automove, Fixmove)

function Automove(data) {
  if (!data) data = {}
  this.speed = data.speed || {position: 1, angle: 10}
  this.keymap = data.keymap || ['Q', 'W', 'E', 'A', 'S', 'D']
  this.heading = data.heading || [-60, 0, 60, -120, -180, 120]
  this.shift = data.shift || [1, 1, 1, 1, 1, 1]
  this.active = _.fill(Array(this.keymap.length), false)
  this.pressed = _.fill(Array(this.keymap.length), false)
  this.tracking = false
}

Automove.prototype.compute = function(keys, current, offset) {
  var self = this

  self.keymap.forEach( function(key, i) {
    if (key in keys & !(_.any(self.active))) {
      self.reset()
      self.clear()
      self.active[i] = true
      self.pressed[i] = true
      self.tracking = true
      self.target = self.seek(current, self.heading[i], self.shift[i], offset)
    }
  })

  if (self.tracking) {
    var dist = current.distance(self.target)
    if (!(dist.position || dist.angle)) self.tracking = false
  } 

  if (!self.tracking) {
    var shift = 2
    if (_.any(self.pressed)) shift = self.shift[_.findIndex(self.pressed)]
    self.target = self.seek(current, 0, shift)
    if (!self.keypress(keys)) self.reset()
  } 

  return self.delta(current, self.target)
}

Automove.prototype.keypress = function(keys) {
  var down = this.keymap.map(function (k) {return k in keys})
  return _.any(down)
}

Automove.prototype.seek = function (current, heading, shift, offset) {
  if (!offset) offset = current

  return {
    position: [
      shift * Math.sin((current.angle() + heading) * Math.PI / 180) + offset.position()[0], 
      shift * -Math.cos((current.angle() + heading) * Math.PI / 180) + offset.position()[1]
    ], 
    angle: current.angle() + heading
  }
}

Automove.prototype.reset = function() {
  this.active = this.active.map( function() {return false})
}

Automove.prototype.clear = function() {
  this.pressed = this.pressed.map( function() {return false})
}