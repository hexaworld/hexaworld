_ = require('lodash')
math = require('mathjs')
aabb = require('aabb-2d')

module.exports = Center

function Center(options){
  options = options || {}
  this.size = options.size || 2
  this.color = options.color || "#DFE0E2"
}

Center.prototype.border = function(transform) {
  var self = this
  var points = _.range(7).map(function(i) {
    var dx = self.size * .1 * transform.scale * Math.cos(i * 2 * Math.PI / 6)
    var dy = self.size * .1 * transform.scale * Math.sin(i * 2 * Math.PI / 6)
    return [dx, dy]
  })
  points = math.multiply(points, transform.rotation)
  return points.map(function(v) {
    return math.add(v,[transform.position.x + game.width/2, transform.position.y + game.height/2])
  })
}

Center.prototype.render = function(context, transform) {
  var border = this.border(transform)
  context.beginPath()
  _.forEach(border, function(point) {
    context.lineTo(point[0], point[1])
  })
  context.closePath()
  context.fillStyle = this.color
  context.fill()
}
