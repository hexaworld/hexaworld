var _ = require('lodash')

function Geometry(props, children) {

  this.init(props || {})
  this.children = children || []
  this.update()

}

Geometry.prototype.update = function(context) {

  var self = this

  self.points = self.transform.apply(self.points)

  if (self.parent) self.points = self.parent.transform.apply(self.points)

  if (self.children.length) {
    _.forEach(self.children, function(child) {
      child.parent = self
      child.update()
    })
  }

}

Geometry.prototype.draw = function(context, points) {

  context.beginPath()
  _.forEach(points, function(point) {
    context.lineTo(point[0], point[1])
  })
  context.closePath()
  context.fillStyle = this.props.fill
  context.strokeStyle = this.props.stroke
  context.fill()
  context.stroke()

}

Geometry.prototype.render = function(context, camera) {
  var points = this.points

  points = camera.transform.invert(points)
  points = points.map(function (point) {
    return [point[0] + camera.game.width/2, point[1] + camera.game.height/2]
  })
  this.draw(context, points)

  if (this.children) {
    this.children.forEach(function (child) {
      child.render(context, camera)
    })
  }

}

module.exports = Geometry