var _ = require('lodash')
var transform = require('./transform.js')

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
    var pressed = self.keymap.map(function (k) {return k in keys})
    if (!_.any(pressed)) self.reset()
  } 

  return self.delta(current, self.target)
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

Automove.prototype.delta = function(current, target) {
  var dist = current.distance(target)

  var speed = this.speed
  var velocity = {position: 1, angle: 1}
  var diff = current.difference(target)

  if (dist.position > speed.position) {
    diff.position[0] = diff.position[0] / dist.position
    diff.position[1] = diff.position[1] / dist.position
    velocity.position = speed.position
    if (dist.angle > speed.angle) velocity.position = speed.angle * dist.position / dist.angle
  }

  if (dist.angle > speed.angle) {
    diff.angle = diff.angle / dist.angle
    velocity.angle = speed.angle
  }

  return {
    position: [
      diff.position[0] * velocity.position, 
      diff.position[1] * velocity.position
    ], 
    angle: diff.angle * velocity.angle
  }
}

module.exports = Automove