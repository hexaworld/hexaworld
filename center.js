_ = require('lodash')
aabb = require('aabb-2d')

module.exports = Center

function Center(options){
  options = options || {}
  this.size = options.size || 2
  this.color = options.color || "#DFE0E2"
}

Center.prototype.points = function() {
  var self = this
  var points = _.range(7).map(function(i) {
    var dx = self.size * .1 * Math.cos(i * 2 * Math.PI / 6)
    var dy = self.size * .1 * Math.sin(i * 2 * Math.PI / 6)
    return [dx, dy]
  })
  return points
}

Center.prototype.render = function(context, transform) {
  var points = transform.apply(this.points())
  context.beginPath()
  _.forEach(points, function(point) {
    context.lineTo(point[0], point[1])
  })
  context.closePath()
  context.fillStyle = this.color
  context.fill()
}
