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
  var bottom = transform.y + transform.scale * Math.sqrt(3)/2
  return [
    {x: transform.x - self.width/2 * transform.size, y: transform.y},
    {x: transform.x - self.width/2 * transform.size, y: bottom},
    {x: transform.x + self.width/2 * transform.size, y: bottom},
    {x: transform.x + self.width/2 * transform.size, y: transform.y}
  ]
}

Path.prototype.render = function(context, transform) {
  var border = this.border(transform)
  context.beginPath()
  _.forEach(border, function(point) {
    context.lineTo(point.x, point.y)
  })
  context.closePath()
  context.fillStyle = this.color
  context.fill()
}
