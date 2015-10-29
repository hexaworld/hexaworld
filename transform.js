module.exports = function(opts) {

  opts = opts || {}
  var position, scale, angle, rotation
  
  var set = function (opts) {
    position = opts.position || [0, 0]
    scale = opts.scale || 1
    angle = (opts.angle * Math.PI / 180) || 0
    rotation =  [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]]
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
    position: function () {return position},
    scale: function () {return scale},
    angle: function () {return angle},
    rotation: function () {return rotation}
  }

}
