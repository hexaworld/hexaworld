module.exports = function(opts) {

  opts = opts || {}
  var position, scale, angle, rotation
  
  var set = function (opts) {
    position = opts.position || [0, 0]
    scale = opts.scale || 1
    angle = (opts.angle * Math.PI / 180) || 0
    rotation =  [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]]
  }

  var fwdpoints = function (points) {
    points = points.map( function(xy) {
      return [xy[0] * scale, xy[1] * scale]
    })
    points = points.map( function(xy) {
      return [
        xy[0] * rotation[0][0] + xy[1] * rotation[0][1],
        xy[0] * rotation[1][0] + xy[1] * rotation[1][1],
      ]
    })
    points = points.map(function(xy) {
      return [xy[0] + position[0], xy[1] + position[1]]
    })
    return points
  }

  var invpoints = function (points) {
    points = points.map(function (xy) {
      return [xy[0] - position[0], xy[1] - position[1]]
    })
    points = points.map(function (xy) {
      return [
        xy[0] * rotation[0][0] - xy[1] * rotation[0][1],
        -xy[0] * rotation[1][0] + xy[1] * rotation[1][1]
      ]
    })
    points = points.map(function (xy) {
      return [xy[0] / scale, xy[1] / scale]
    })
    return points
  }

  var fwdparams = function (shape) {
    shape = {
      position: fwdpoints([shape.position])[0],
      angle: shape.angle + angle,
      scale: shape.scale * scale
    }
    return shape
  }

  var invparams = function (shape) {
    shape = {
      position: invpoints([shape.position])[0],
      angle: shape.angle - angle,
      scale: shape.scale / scale
    }
    return shape
  }

  var apply = function (obj) {
    if (obj instanceof Array) return fwdpoints(obj)
    return fwdparams(obj)
  }

  var invert = function (obj) {
    if (obj instanceof Array) return invpoints(obj)
    return invparams(obj)
  }

  var position = function () {
    return position
  }

  set(opts)

  return {
    apply: apply,
    invert: invert,
    set: set,
    position: function () {return position},
    scale: function () {return scale},
    angle: function () {return angle},
    rotation: function () {return rotation}
  }

}
