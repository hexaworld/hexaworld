var _ = require('lodash')
var transform = require('./transform.js')

function Automove(data) {
  if (!data) data = {}
  this.speed = data.speed || {position: 1, angle: 10}
  this.keymap = data.keymap || {angle: ['Q', 'W', 'E', 'A', 'S', 'D']}
  this.on = {angle: [false, false, false, false, false, false]}
  this.end = 0
}

Automove.prototype.compute = function(keys, start, offset, state) {
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

  // var heading = {
  //   position: [210, -90, -30, -210, -270, 30], 
  //   angle: [-60, 0, 60, -120, -180, 120]
  // }

  // // function of index that sets self.end based on which key was pressed

  // var setkey = function(ind) {
  //   // set self.on
  //   // update position using position heading and angle heading

  // if (keymap.angle) {

  // }

  

  var height = 8

  if (check(0)) {
    if (state) {
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
    if (state) {
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
    if (state) {
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
    if (state) {
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
    if (state) {
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
    if (state) {
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

Automove.prototype.reset = function() {
  var self = this
  _.range(6).forEach(function (i) {
    self.on.angle[i] = false
  })
}

Automove.prototype.any = function() {
  var self = this
  return _.any(self.on.angle)
}

Automove.prototype.delta = function(start, end) {

  var speed = this.speed
  var velocity = {position: 1, angle: 1}

  var diff = start.difference(end)
  var dist = start.distance(end)

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