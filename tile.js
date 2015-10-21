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
  this.color = options.color || '#DFE0E2s'
}

Tile.prototype.transform = function(camera) {

  var scale = this.size * 0.1 * camera.position.z
  var x = scale * 3/2 * this.position.r + camera.position.x
  var y = scale * Math.sqrt(3) * (this.position.q + this.position.r/2) + camera.position.y
  var angle = camera.orientation * Math.PI / 180
  var rotation = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]] 
  return {position: {x: x, y: y}, scale: scale, rotation: rotation}

}

Tile.prototype.border = function(transform) {

  var points = _.range(7).map(function(i) {
    var dx = transform.scale * Math.cos(i * 2 * Math.PI / 6)
    var dy = transform.scale * Math.sin(i * 2 * Math.PI / 6)
    return [transform.position.x + dx, transform.position.y + dy]
  })
  return math.multiply(points, transform.rotation)

}

Tile.prototype.draw = function(context, transform) {

  var border = this.border(transform)
  context.beginPath()
  _.forEach(border, function(point) {
    context.lineTo(point[0], point[1])
  })
  context.closePath()
  context.fillStyle = "#DFE0E2"
  context.fill()

}

Tile.prototype.render = function(context, camera) {

  var transform = this.transform(camera)

  this.draw(context, transform)

  this.center.render(context, transform)

  this.paths.forEach(function (path) {
    path.render(context, transform)
  })

}