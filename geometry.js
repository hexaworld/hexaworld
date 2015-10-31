var _ = require('lodash')
var inside = require('point-in-polygon')
var sat = require('sat')
var transform = require('./transform.js')

function Geometry(data) {
  if (!data.props) throw new Error('Must provide properties')
  if (!data.points) throw new Error('Must provide points')
  this.props = data.props
  this.points = data.points
  this.obstacle = data.obstacle
  if (_.isArray(data.children)) {
    this.children = data.children
  } else {
    this.children = data.children ? [data.children] : []
  }
  this.transform = data.transform ? transform(data.transform) : transform()  
  this.stage()
}

Geometry.prototype.stage = function(transform, opts) {
  var self = this
  opts = opts || {}
  transform = transform || self.transform
  op = opts.invert ? transform.invert : transform.apply
  self.points = op(self.points)
  if (self.children.length) {
    _.forEach(self.children, function(child) {
      child.stage(transform, opts)
    })
  }
}

Geometry.prototype.unstage = function() {
  var self = this
  var t = transform({
    position: self.transform.position(),
    scale: self.transform.scale(),
    angle: self.transform.angle()
  })
  self.stage(t, {invert: true})
}

Geometry.prototype.contains = function(point) {
  var self = this
  return inside(point, self.points)
}

Geometry.prototype.intersects = function(other) {
  var self = this
  var response = new sat.Response();
  var selfPoly = new sat.Polygon(
    new sat.Vector(), 
    self.points.map(function (xy) {return new sat.Vector(xy[0], xy[1])})
  )
  var otherPoly = new sat.Polygon(
    new sat.Vector(), 
    other.points.map(function (xy) {return new sat.Vector(xy[0], xy[1])})
  )
  var collision = sat.testPolygonPolygon(selfPoly, otherPoly, response)
  if (collision) return {collision: collision, response: response}
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

Geometry.prototype.drawChildren = function(context, camera) {
  if (this.children) {
    this.children.forEach(function (child) {
      child.draw(context, camera)
    })
  }
}

Geometry.prototype.drawSelf = function(context, camera) {
  var points = this.points 
  points = camera.transform.invert(points)
  points = points.map(function (xy) {
    return [xy[0] + camera.game.width/2, xy[1] + 2*camera.game.height/4]
  })
  if (this.props.type == 'polygon') this.drawPolygon(context, points)
  if (this.props.type == 'bezier') this.drawBezier(context, points)
}

Geometry.prototype.draw = function(context, camera, opts) {
  opts = opts || {order: 'top'}
  if (opts.order === 'top') {
    this.drawSelf(context, camera)
    this.drawChildren(context, camera)
  } else if (opts.order === 'bottom') {
    this.drawChildren(context, camera)
    this.drawSelf(context, camera)
  } else {
    throw Error('Order ' + opts.order + ' not recognized')
  }
}

module.exports = Geometry