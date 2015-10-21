aabb = require('aabb-2d')
_ = require('lodash')

module.exports = Center

function Center(options){
  options = options || {}
  this.size = options.size || 0.2
  this.color = options.color || '#939597'
}

Center.prototype.border = function(transform) {
  var self = this
  return _.range(7).map(function(i) {
    var dx = self.size * transform.scale * Math.cos(i * 2 * Math.PI / 6)
    var dy = self.size * transform.scale * Math.sin(i * 2 * Math.PI / 6)
    return {x: transform.position.x + dx, y: transform.position.y + dy}
  })
}

Center.prototype.render = function(context, transform) {
    var border = this.border(transform)
    context.beginPath()
    _.forEach(border, function(point) {
      context.lineTo(point.x, point.y)
    })
    context.closePath()
    context.fillStyle = this.color
    context.fill()
}
