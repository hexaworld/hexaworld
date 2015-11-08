var _ = require('lodash')
var transform = require('./transform.js')

function Tracker(data) {
  if (!data) data = {}
  this.keymap = data.keymap || {angle: ['Q', 'W', 'E', 'A', 'S', 'D']}
  this.on = {angle: [false, false, false, false, false, false]}
  this.end = 0
}

Tracker.prototype.compute = function(keys, start, offset, container) {
  var self = this

  var check = function(i) {
    return self.keymap.angle[i] in keys & !self.any()
  }

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
    var distance = self.distance(start, self.end)
    if (distance.position || distance.angle) {
      return self.delta(start, self.end)
    } else {
      self.reset()
      self.end = 0
      return forward
    }
  } else {
    return forward
  }

}

Tracker.prototype.reset = function() {
  var self = this
  _.range(6).forEach(function (i) {
    self.on.angle[i] = false
  })
}

Tracker.prototype.any = function() {
  var self = this
  return _.any(self.on.angle)
}

Tracker.prototype.distance = function(start, end) {

  var x = (end.position[0] - start.position()[0])
  var y = (end.position[1] - start.position()[1])
  var s = end.angle - start.angle()
  return {position: Math.sqrt(Math.pow(x, 2) + Math.pow(x, 2)), angle: Math.abs(s)}

}

Tracker.prototype.delta = function(start, end) {

  var x = (end.position[0] - start.position()[0])
  var y = (end.position[1] - start.position()[1])
  var s = end.angle - start.angle()

  var speed = {position: 1.0, angle: 10.0}

  var distance = {position: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), angle: Math.abs(s)}

  if (distance.position > speed.position) {
    x = x/distance.position
    y = y/distance.position
  } else {
    speed.position = 1
  }

  if (distance.angle > speed.angle) {
    if (distance.position > speed.position) {
      speed.angle = speed.position * distance.angle / distance.position
    } 
    s = s/distance.angle
  } else {
    speed.angle = 1
  }

  return {position: [x * speed.position, y * speed.position], angle: s * speed.angle}

}

module.exports = Tracker