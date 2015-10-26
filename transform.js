math = require('mathjs')

module.exports = Transform

function Transform(parameters){
  this.position = parameters.position
  this.scale = parameters.scale
  this.rotation = parameters.rotation
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
    return [point[0] + self.position.x + game.width/2, point[1] + self.position.y + game.height/2]
  })

  return points
}