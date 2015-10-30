module.exports = function(opts) {

  opts = opts || {}
  var position, scale, angle, rotation
  
  var set = function (opts) {
    position = opts.position || [0, 0]
    scale = opts.scale || 1
    angle = opts.angle || 0
    rotation = rotmat(angle)
  }

  var update = function (opts) {
    position = opts.position 
      ? [position[0] + opts.position[0], position[1] + opts.position[1]] 
      : position
    angle = opts.angle ? angle + opts.angle : angle
    scale = opts.scale ? Math.exp(Math.log(scale) + opts.scale) : scale
    rotation = rotmat(angle)
  }

  var rotmat = function (angle) {
    var rad = angle * Math.PI / 180
    return [[Math.cos(rad), -Math.sin(rad)], [Math.sin(rad), Math.cos(rad)]]
  }

  var apply = function (points) {
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

  var invert = function (points) {
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

  set(opts)

  return {
    apply: apply,
    invert: invert,
    set: set,
    update: update,
    position: function () {return position},
    scale: function () {return scale},
    angle: function () {return angle},
    rotation: function () {return rotation}
  }

}
