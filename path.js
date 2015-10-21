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

Path.prototype.border = function(origin) {
  var self = this
  var bottom = origin.y + origin.size * Math.sqrt(3)/2
  return [
    {x: origin.x - self.width/2 * origin.size, y: origin.y},
    {x: origin.x - self.width/2 * origin.size, y: bottom},
    {x: origin.x + self.width/2 * origin.size, y: bottom},
    {x: origin.x + self.width/2 * origin.size, y: origin.y}
  ]
}

Path.prototype.render = function(context, origin) {
  var border = this.border(origin)
  context.beginPath()
  _.forEach(border, function(point) {
    context.lineTo(point.x, point.y)
  })
  context.closePath()
  context.fillStyle = this.color
  context.fill()
}
