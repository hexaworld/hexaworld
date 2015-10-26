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

Path.prototype.border = function(transform) {
  var self = this
  var bottom = transform.scale * Math.sqrt(3)/2
  var points = [
    [-self.width/2 * transform.scale, 0],
    [-self.width/2 * transform.scale, bottom],
    [self.width/2 * transform.scale, bottom],
    [self.width/2 * transform.scale, 0]
  ]
  points = math.multiply(points, transform.rotation)
  return points.map(function(v) {
    return math.add(v,[transform.position.x + game.width/2, transform.position.y + game.height/2])
  })
}

Path.prototype.render = function(context, transform) {
  var border = this.border(transform)
  context.beginPath()
  _.forEach(border, function(point) {
    context.lineTo(point[0], point[1])
  })
  context.closePath()
  context.fillStyle = this.color
  context.fill()
}
