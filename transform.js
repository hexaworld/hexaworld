module.exports = Transform

function Transform(parameters){
  this.position = parameters.position || {x: 0, y: 0}
  this.scale = parameters.scale || 1
  this.rotation = rotmat((parameters.rotation * Math.PI / 180) || 0)
  return this
}

Transform.prototype.apply = function(points) {
  var self = this

  // rescale
  points = points.map( function(point) {
    return [point[0] * self.scale, point[1] * self.scale]
  })

  // rotate
  points = points.map( function(point) {
    return [
      point[0] * self.rotation[0][0] + point[1] * self.rotation[0][1],
      point[0] * self.rotation[1][0] + point[1] * self.rotation[1][1],
    ]
  })

  // translate
  points = points.map(function(point) {
    return [point[0] + self.position.x, point[1] + self.position.y]
  })
  return points
}

Transform.prototype.invert = function(points) {
  var self = this

  // translate
  points = points.map(function(point) {
    return [point[0] - self.position.x, point[1] - self.position.y]
  })

  // rotate
  points = points.map( function(point) {
    return [
      point[0] * self.rotation[0][0] - point[1] * self.rotation[0][1],
      - point[0] * self.rotation[1][0] + point[1] * self.rotation[1][1],
    ]
  })

  // rescale
  points = points.map( function(point) {
    return [point[0] / self.scale, point[1] / self.scale]
  })

  return points
}


Transform.prototype.update = function(parameters) {
  if (parameters.position) this.position = parameters.position
  if (parameters.scale) this.scale = parameters.scale
  if (parameters.rotation) this.rotation = rotmat(parameters.rotation * Math.PI / 180)
}

rotmat = function(theta) {
  return [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]] 
}
