aabb = require('aabb-2d')
_ = require('lodash')

module.exports = Path

function Path(options){
  var options = options || {}
  this.position = 0
  this.type = 'path'
  this.width = options.width || 0.2
  this.color = options.color || '#939597'
}

Path.prototype.border = function(transform) {
  var self = this
  var bottom = transform.position.y + transform.scale * Math.sqrt(3)/2
  var points = [
    [transform.position.x - self.width/2 * transform.scale, transform.position.y],
    [transform.position.x - self.width/2 * transform.scale, bottom],
    [transform.position.x + self.width/2 * transform.scale, bottom],
    [transform.position.x + self.width/2 * transform.scale, transform.position.y]
  ]
  return math.multiply(points, transform.rotation)
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
