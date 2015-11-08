var _ = require('lodash')
var transform = require('./transform.js')

function Autohead(data) {
  if (!data) data = {}
  this.speed = data.speed || {position: 1, angle: 10}
  this.keymap = data.keymap || {angle: ['Q', 'W', 'E', 'A', 'S', 'D']}
  this.on = {angle: [false, false, false, false, false, false]}
  this.end = 0
}

Autohead.prototype.compute = function(keys, start, offset, container) {
  var self = this

  var check = function(i) {
    return self.keymap.angle[i] in keys & !self.any()
  }
  var pressed = function(i) {
    return self.keymap.angle[i] in keys
  }
 var released = !(pressed(0) || pressed(1) || pressed(2)  || pressed(3) || pressed(4) || pressed(5))

  var rad = function(a) {
    return a * Math.PI / 180
  }

  var height = 8

  if (check(0)) {
    if (container.contains(start.position())) {
      self.on.angle[0] = true
      self.end = {
        position: [height * Math.cos(rad(start.angle() + 210)), height * Math.sin(rad(start.angle() + 210))], 
        angle: start.angle() - 60
      }
      self.end.position[0] += offset.position()[0]
      self.end.position[1] += offset.position()[1]
    } 
  }

  if (check(1)) {
    if (container.contains(start.position())) {
      self.on.angle[1] = true
      self.end = {
        position: [height * Math.cos(rad(start.angle() - 90)), height * Math.sin(rad(start.angle() - 90))], 
        angle: start.angle()
      }
      self.end.position[0] += offset.position()[0]
      self.end.position[1] += offset.position()[1]
    }
  }

  if (check(2)) {
    if (container.contains(start.position())) {
      self.on.angle[2] = true
      self.end = {
        position: [height * Math.cos(rad(start.angle() - 30)), height * Math.sin(rad(start.angle() - 30))], 
        angle: start.angle() + 60
      }
      self.end.position[0] += offset.position()[0]
      self.end.position[1] += offset.position()[1]
    }
  }

  if (check(3)) {
    if (container.contains(start.position())) {
      self.on.angle[3] = true
      self.end = {
        position: [height * Math.cos(rad(start.angle() - 210)), height * Math.sin(rad(start.angle() - 210))], 
        angle: start.angle() - 120
      }
      self.end.position[0] += offset.position()[0]
      self.end.position[1] += offset.position()[1]
    }
  }

  if (check(4)) {
    if (container.contains(start.position())) {
      self.on.angle[4] = true
      self.end = {
        position: [height * Math.cos(rad(start.angle() - 270)), height * Math.sin(rad(start.angle() - 270))], 
        angle: start.angle() - 180
      }
      self.end.position[0] += offset.position()[0]
      self.end.position[1] += offset.position()[1]
    } else {
      self.on.angle[4] = true
      var rad = (start.angle() - 180) * Math.PI / 180
      self.end = {
        position: [start.position()[0] + 0.5 * Math.sin(rad), start.position()[1] - 0.5 * Math.cos(rad)], 
        angle: start.angle() - 180
      }
    }
  }

  if (check(5)) {
    if (container.contains(start.position())) {
      self.on.angle[5] = true
      self.end = {
        position: [height * Math.cos(rad(start.angle() + 30)), height * Math.sin(rad(start.angle() + 30))], 
        angle: start.angle() + 120
      }
      self.end.position[0] += offset.position()[0]
      self.end.position[1] += offset.position()[1]
    }
  }

  var rad = start.angle() * Math.PI / 180
  var forward = {position: [0.75 * Math.sin(rad), 0.75 * -Math.cos(rad)]}

  if (self.end) {
    var distance = start.distance(self.end)
    if (distance.position || distance.angle) {
      return self.delta(start, self.end)
    } else {
      if (released) self.reset()
      self.end = 0
      return forward
    }
  } else {
      if (released) self.reset()
      return forward
  }

}

Autohead.prototype.reset = function() {
  var self = this
  _.range(6).forEach(function (i) {
    self.on.angle[i] = false
  })
}

Autohead.prototype.any = function() {
  var self = this
  return _.any(self.on.angle)
}

Autohead.prototype.delta = function(start, end) {

  var speed = this.speed
  var scale = {position: 1, angle: 1}

  var diff = start.difference(end)
  var dist = start.distance(end)

  if (dist.position > speed.position) {
    diff.position[0] = diff.position[0] / dist.position
    diff.position[1] = diff.position[1] / dist.position
    scale.position = speed.position
    if (dist.angle > speed.angle) scale.position = speed.angle * dist.position / dist.angle
  }

  if (dist.angle > speed.angle) {
    diff.angle = diff.angle / dist.angle
    scale.angle = speed.angle
  }

  return {
    position: [
      diff.position[0] * scale.position, 
      diff.position[1] * scale.position
    ], 
    angle: diff.angle * scale.angle
  }
}

module.exports = Autohead