var _ = require('lodash')

function Geometry(props, children) {

  this.init(props || {})
  this.children = children || []
  this.update()

}

Geometry.prototype.update = function(transform) {

  var self = this
  
  transform = transform || self.transform
  
  self.points = transform.apply(self.points)

  if (self.children.length) {
    _.forEach(self.children, function(child) {
      child.update(transform)
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
    return [point[0] + camera.game.width/2, point[1] + 2*camera.game.height/4]
  })
  this.draw(context, points)

  if (this.children) {
    this.children.forEach(function (child) {
      child.render(context, camera)
    })
  }

}

module.exports = Geometry