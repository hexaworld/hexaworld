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
  this.auto = data.auto
  this.active = _.fill(Array(this.keymap.length), false)
  this.last = _.fill(Array(this.keymap.length), false)
  this.tracking = false
}

Automove.prototype.compute = function(keys, current, offset) {
  var self = this

  self.keymap.forEach( function(key, i) {
    if (key in keys & !(_.any(self.active))) {
      self.resetlast()
      self.active[i] = true
      self.last[i] = true
      self.tracking = true
      self.target = self.seek(current, self.heading[i], self.shift[i], offset)
    }
  })

  if (self.tracking) {
    var dist = current.distance(self.target)
    if (!(dist.position || dist.angle)) self.tracking = false
  } 

  if (!self.tracking) {
    var shift = 1
    if (!self.auto & _.any(self.last)) shift = self.shift[_.findIndex(self.last)]
    self.target = self.seek(current, 0, shift)
    if (!self.keypress(keys)) self.reset()
  } 

  return self.delta(current, self.target)
}

Automove.prototype.keypress = function(keys) {
  var pressed = this.keymap.map(function (k) {return k in keys})
  return _.any(pressed)
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
  var self = this
  self.keymap.forEach(function (k, i) {
    self.active[i] = false
  })
}

Automove.prototype.resetlast = function() {
  var self = this
  self.keymap.forEach(function (k, i) {
    self.last[i] = false
  })
}