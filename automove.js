var _ = require('lodash')
var transform = require('./transform.js')

function Automove(data) {
  if (!data) data = {}
  this.speed = data.speed || {position: 1, angle: 10}
  this.keymap = data.keymap || ['Q', 'W', 'E', 'A', 'S', 'D']
  this.heading = [-60, 0, 60, -120, -180, 120]
  this.active = [false, false, false, false, false, false]
  this.target = 0
}

Automove.prototype.compute = function(keys, current, offset, allowed) {
  var self = this

      // self.on[4] = true
      // var rad = (start.angle() - 180) * Math.PI / 180
      // self.end = {
      //   position: [start.position()[0] + 0.5 * Math.sin(rad), start.position()[1] - 0.5 * Math.cos(rad)], 
      //   angle: start.angle() - 180
      // }

  self.keymap.forEach( function(key, i) {
    if (key in keys & !(_.any(self.active)) & allowed) {
      self.active[i] = true
      self.target = self.seek(current, self.heading[i], offset)
    }
  })

  if (self.target) {
    var dist = current.distance(self.target)
    if (!(dist.position || dist.angle)) self.target = 0
  }

  var pressed = self.keymap.map(function (k) {return k in keys})
  if (!_.any(pressed)) self.reset()

  if (!self.target) return self.baseline(current)

  return self.delta(current, self.target)

}

Automove.prototype.seek = function (current, heading, offset) {
  return {
    position: [
      8 * Math.cos((current.angle() + heading - 90) * Math.PI / 180) + offset.position()[0], 
      8 * Math.sin((current.angle() + heading - 90) * Math.PI / 180) + offset.position()[1]
    ], 
    angle: current.angle() + heading
  }
}

Automove.prototype.baseline = function (current) {
  return {
    position: [
      0.75 * Math.sin(current.angle() * Math.PI / 180), 
      0.75 * -Math.cos(current.angle() * Math.PI / 180)
    ]
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