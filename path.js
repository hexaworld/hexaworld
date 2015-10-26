aabb = require('aabb-2d')
_ = require('lodash')

module.exports = Path

function Path(options){
  var options = options || {}
  this.position = 0
  this.type = 'path'
  this.width = options.width || 0.2
  this.color = options.color || "#DFE0E2"
}

Path.prototype.points = function() {
  var self = this
  var bottom = Math.sqrt(3)/2
  var points = [
    [-self.width/2, 0],
    [-self.width/2, bottom],
    [self.width/2, bottom],
    [self.width/2, 0]
  ]
  return points
}

Path.prototype.render = function(context, transform) {
  var points = transform.apply(this.points())
  context.beginPath()
  _.forEach(points, function(point) {
    context.lineTo(point[0], point[1])
  })
  context.closePath()
  context.fillStyle = this.color
  context.fill()
}
