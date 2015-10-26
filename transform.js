math = require('mathjs')

module.exports = Transform

function Transform(parameters){
  this.position = parameters.position || {x: 0, y: 0}
  this.scale = parameters.scale || 1
  var theta = (parameters.rotation * Math.PI / 180) || 0
  this.rotation = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]] 
  return this
}

Transform.prototype.apply = function(points) {
  var self = this

  // rescale
  points = points.map( function(point) {
    return [point[0] * self.scale, point[1] * self.scale]
  })
  // rotate
  points = math.multiply(points, self.rotation)
  
  // translate
  points = points.map(function(point) {
    return [point[0] + self.position.x, point[1] + self.position.y]
  })
  return points
}

Transform.prototype.update = function(parameters) {
  if (parameters.position) this.position = parameters.position
  if (parameters.scale) this.scale = parameters.scale
  if (parameters.rotation) {
    var theta = parameters.rotation * Math.PI / 180
    this.rotation = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]] 
  }
}