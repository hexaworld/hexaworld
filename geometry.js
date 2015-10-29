var _ = require('lodash')
var transform = require('./transform.js')

function Geometry(data) {
  if (!data.props) throw new Error('Must provide properties')
  if (!data.points) throw new Error('Must provide points')
  this.props = data.props
  this.points = data.points
  if (_.isArray(data.children)) {
    this.children = data.children
  } else {
    this.children = data.children ? [data.children] : []
  }
  this.transform = data.transform ? transform(data.transform) : transform()  
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

Geometry.prototype.drawPolygon = function(context, points) {
  context.beginPath()
  _.forEach(points, function(xy) {
    context.lineTo(xy[0], xy[1])
  })
  context.closePath()
  context.fillStyle = this.props.fill
  context.strokeStyle = this.props.stroke
  context.fill()
  context.stroke()
}

Geometry.prototype.drawBezier = function(context, points) {
  var n = points.length / 3
  context.beginPath()
  context.fillStyle = this.props.fill
  context.strokeStyle = this.props.stroke
  context.moveTo(points[0][0], points[0][1])
  _.range(n).forEach(function (i) {
    var b1 = points[i*3+1]
    var b2 = points[i*3+2]
    var b3 = i === (n - 1) ? points[0] : points[i*3+3]
    context.bezierCurveTo(b1[0], b1[1], b2[0], b2[1], b3[0], b3[1])
  })
  context.closePath()
  context.stroke()
  context.fill()
}

Geometry.prototype.render = function(context, camera) {
  var points = this.points
  points = camera.transform.invert(points)
  points = points.map(function (xy) {
    return [xy[0] + camera.game.width/2, xy[1] + 2*camera.game.height/4]
  })

  if (this.props.type == 'polygon') this.drawPolygon(context, points)
  if (this.props.type == 'bezier') this.drawBezier(context, points)

  if (this.children) {
    this.children.forEach(function (child) {
      child.render(context, camera)
    })
  }
}

module.exports = Geometry