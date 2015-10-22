_ = require('lodash')
math = require('mathjs')
Path = require('./path.js')
Center = require('./center.js')

module.exports = Tile

function Tile(options){
  this.position = { 
    r: options.position.r, 
    q: options.position.q
  }
  this.paths = options.paths || [new Path({position: 0}), new Path({position: 1})]
  this.center = new Center()
  this.size = options.size || 50
  this.color = options.color || '#A5A5A5'
}

Tile.prototype.transform = function(camera) {

  var scale = this.size * 0.1 * camera.position.z
  var x = scale * 3/2 * this.position.r
  var y = scale * Math.sqrt(3) * (this.position.q + this.position.r/2)
  var angle = camera.orientation * Math.PI / 180
  var rotation = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]] 
  var position = math.multiply([x, y], rotation)
  x = position[0] + camera.position.x
  y = position[1] + camera.position.y
  return {position: {x: x, y: y}, scale: scale, rotation: rotation}

}

Tile.prototype.border = function(transform) {

  var points = _.range(7).map(function(i) {
    var dx = transform.scale * Math.cos(i * 2 * Math.PI / 6)
    var dy = transform.scale * Math.sin(i * 2 * Math.PI / 6)
    return [dx, dy]
  })
  points = math.multiply(points, transform.rotation)
  return points.map(function(v) {
    return math.add(v,[transform.position.x, transform.position.y])
  })
}

Tile.prototype.draw = function(context, transform) {

  var border = this.border(transform)
  context.beginPath()
  _.forEach(border, function(point) {
    context.lineTo(point[0], point[1])
  })
  context.closePath()
  context.fillStyle = this.color
  context.strokeStyle = this.color
  context.fill()
  context.stroke()

}

Tile.prototype.render = function(context, camera) {

  var transform = this.transform(camera)

  this.draw(context, transform)

  this.center.render(context, transform)

  this.paths.forEach(function (path) {
    path.render(context, transform)
  })

}