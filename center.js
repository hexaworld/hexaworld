aabb = require('aabb-2d')
_ = require('lodash')

module.exports = Center

function Center(options){
  options = options || {}
  this.size = options.size || 0.2
  this.color = options.color || '#939597'
}

Center.prototype.border = function(origin) {
  var self = this
  return _.range(7).map(function(i) {
    var dx = self.size * origin.size * Math.cos(i * 2 * Math.PI / 6)
    var dy = self.size * origin.size * Math.sin(i * 2 * Math.PI / 6)
    return {x: origin.x + dx, y: origin.y + dy}
  })
}

Center.prototype.render = function(context, origin) {
    var border = this.border(origin)
    context.beginPath()
    _.forEach(border, function(point) {
      context.lineTo(point.x, point.y)
    })
    context.closePath()
    context.fillStyle = this.color
    context.fill()
}
