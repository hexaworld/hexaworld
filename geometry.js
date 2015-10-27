var _ = require('lodash')

function Geometry(props, children) {

  this.init(props || {})
  this.children = children || []
  this.update()

}

Geometry.prototype.update = function(transform) {
  var self = this
  transform = transform || self.transform
  self.shape = transform.apply(self.shape)
  if (self.children.length) {
    _.forEach(self.children, function(child) {
      child.update(transform)
    })
  }
}

Geometry.prototype.drawPolygon = function(context, shape) {
  context.beginPath()
  _.forEach(shape, function(xy) {
    context.lineTo(xy[0], xy[1])
  })
  context.closePath()
  context.fillStyle = this.props.fill
  context.strokeStyle = this.props.stroke
  context.fill()
  context.stroke()
}

Geometry.prototype.drawCircle = function(context, shape) {
  context.beginPath()
  context.fillStyle = this.props.fill
  context.strokeStyle = this.props.stroke
  context.arc(shape.center.x, shape.center.y , shape.size, 0, 2*Math.PI)
  context.stroke()
  context.fill()
}

Geometry.prototype.drawEllipse = function(context, shape) {

}

Geometry.prototype.render = function(context, camera) {
  var shape = this.shape
  shape = camera.transform.invert(shape)

  if (this.props.type == 'polygon') {
    shape = shape.map(function (xy) {
      return [xy[0] + camera.game.width/2, xy[1] + 2*camera.game.height/4]
    })
  } else {
    shape.center.x += camera.game.width/2
    shape.center.y += camera.game.height/2
  }
   
  if (this.props.type == 'polygon') this.drawPolygon(context, shape)
  if (this.props.type == 'circle') this.drawCircle(context, shape)
  if (this.props.ellipse == 'ellipse') this.drawEllipse(context, shape)

  if (this.children) {
    this.children.forEach(function (child) {
      child.render(context, camera)
    })
  }
}

module.exports = Geometry