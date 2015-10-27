aabb = require('aabb-2d')
_ = require('lodash')

module.exports = Path

function Path (props) {
  if (!props) props = {}
  this.parent = props.parent
  this.type = 'path'
  this.width = props.width || 0.2
  this.color = props.color || "#DFE0E2"
  this.init()
}

Path.prototype.init = function() {
  var self = this
  var bottom = Math.sqrt(3)/2
  var points = [
    [-self.width/2, 0],
    [-self.width/2, bottom],
    [self.width/2, bottom],
    [self.width/2, 0]
  ]
  if (this.parent) points = this.parent.transform.apply(points)
  this.points = points
}

Path.prototype.draw = function(context, points) {
  context.beginPath()
  _.forEach(points, function(point) {
    context.lineTo(point[0], point[1])
  })
  context.closePath()
  context.fillStyle = this.color
  context.fill()
}

Path.prototype.render = function(context, camera) {
  var points = this.points
  points = camera.transform.apply(points)
  this.draw(context, points)
}
