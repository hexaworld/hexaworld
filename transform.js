var _ = require('lodash')

module.exports = function(parameters) {

  parameters = parameters || {}
  var position = parameters.position || {x: 0, y: 0}
  var scale = parameters.scale || 1
  var theta = (parameters.rotation * Math.PI / 180) || 0
  var rotation =  [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]]

  var points = function (shape) {
    shape = shape.map( function(xy) {
      return [xy[0] * scale, xy[1] * scale]
    })
    shape = shape.map( function(xy) {
      return [
        xy[0] * rotation[0][0] + xy[1] * rotation[0][1],
        xy[0] * rotation[1][0] + xy[1] * rotation[1][1],
      ]
    })
    shape = shape.map(function(xy) {
      return [xy[0] + position.x, xy[1] + position.y]
    })
    return shape
  }

  var invpoints = function (shape) {
    shape = shape.map(function (xy) {
      return [xy[0] - position.x, xy[1] - position.y]
    })
    shape = shape.map(function (xy) {
      return [
        xy[0] * rotation[0][0] - xy[1] * rotation[0][1],
        -xy[0] * rotation[1][0] + xy[1] * rotation[1][1]
      ]
    })
    shape = shape.map(function (xy) {
      return [xy[0] / scale, xy[1] / scale]
    })
    return shape
  }

  var params = function (shape) {
    var newcenter = points([[shape.center.x, shape.center.y]])
    shape = {
      center: {x: newcenter[0][0], y: newcenter[0][1]},
      orientation: shape.orientation + theta,
      size: shape.size * scale
    }
    return shape
  }

  var invparams = function (shape) {
    var newcenter = invpoints([[shape.center.x, shape.center.y]])
    shape = {
      center: {x: newcenter[0][0], y: newcenter[0][1]},
      orientation: shape.orientation - theta,
      size: shape.size / scale
    }
    return shape
  }

  var apply = function (shape) {
    if (_.isArray(shape)) return points(shape)
    if (_.isObject(shape)) return params(shape)
  }

  var invert = function (shape) {
    if (_.isArray(shape)) return invpoints(shape)
    if (_.isObject(shape)) return invparams(shape)
  }

  return {
    apply: apply,
    invert: invert,
    position: position,
    scale: scale,
    rotation: rotation
  }

}
