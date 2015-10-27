_ = require('lodash')
aabb = require('aabb-2d')

module.exports = Center

function Center(props){
  if (!props) props = {}
  this.parent = props.parent
  this.size = props.size || 2
  this.color = props.color || "#DFE0E2"
  this.init()
}

Center.prototype.init = function() {
  var self = this
  var points = _.range(7).map(function(i) {
    var dx = self.size * .1 * Math.cos(i * 2 * Math.PI / 6)
    var dy = self.size * .1 * Math.sin(i * 2 * Math.PI / 6)
    return [dx, dy]
  })
  if (this.parent) points = this.parent.transform.apply(points)
  this.points = points
}

Center.prototype.draw = function(context, points) {
  context.beginPath()
  _.forEach(points, function(point) {
    context.lineTo(point[0], point[1])
  })
  context.closePath()
  context.fillStyle = this.color
  context.fill()
}

Center.prototype.render = function(context, camera) {
  var points = this.points
  points = camera.transform.invert(points)
  // translate
  points = points.map(function(point) {
    return [point[0] + this.game.width/2, point[1] + this.game.height/2]
  })
  this.draw(context, points)
}
