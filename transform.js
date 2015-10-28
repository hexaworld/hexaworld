module.exports = function(opts) {

  opts = opts || {}
  var position, scale, angle, rotation
  
  var set = function (opts) {
    position = opts.position || [0, 0]
    scale = opts.scale || 1
    angle = (opts.angle * Math.PI / 180) || 0
    rotation =  [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]]
  }

  var fwdpoints = function (shape) {
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
      return [xy[0] + position[0], xy[1] + position[1]]
    })
    return shape
  }

  var invpoints = function (shape) {
    shape = shape.map(function (xy) {
      return [xy[0] - position[0], xy[1] - position[1]]
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

  var apply = function (shape) {
    if (shape instanceof Array) return fwdpoints(shape)
    return fwdparams(shape)
  }

  var invert = function (shape) {
    if (shape instanceof Array) return invpoints(shape)
    return invparams(shape)
  }

  set(opts)

  return {
    apply: apply,
    invert: invert,
    position: position,
    scale: scale,
    angle: angle,
    rotation: rotation,
    set: set
  }

}
