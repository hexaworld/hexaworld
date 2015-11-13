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
  this.shift = data.shift || 1
  this.active = [false, false, false, false, false, false]
  this.tracking = false
}

Automove.prototype.compute = function(keys, current, offset) {
  var self = this

  self.keymap.forEach( function(key, i) {
    if (key in keys & !(_.any(self.active))) {
      self.active[i] = true
      self.target = self.seek(current, self.heading[i], offset)
      self.tracking = true
    }
  })

  if (self.tracking) {
    var dist = current.distance(self.target)
    if (!(dist.position || dist.angle)) self.tracking = false
  } 

  if (!self.tracking) {
    self.target = self.seek(current, 0)
    if (!self.keypress(keys)) self.reset()
  } 

  return self.delta(current, self.target)
}

Automove.prototype.keypress = function(keys) {
  var pressed = this.keymap.map(function (k) {return k in keys})
  return _.any(pressed)
}

Automove.prototype.seek = function (current, heading, offset) {
  if (!offset) offset = current

  return {
    position: [
      this.shift * Math.sin((current.angle() + heading) * Math.PI / 180) + offset.position()[0], 
      this.shift * -Math.cos((current.angle() + heading) * Math.PI / 180) + offset.position()[1]
    ], 
    angle: current.angle() + heading
  }
}

Automove.prototype.reset = function() {
  var self = this
  self.keymap.forEach(function (k, i) {
    self.active[i] = false
  })
}