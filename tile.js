_ = require('lodash')
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
  var rotation = camera.orientation * Math.PI / 180
  x = x * Math.cos(rotation) - x * Math.sin(rotation)
  y = y * Math.sin(rotation) + y * Math.cos(rotation)
  return {position: {x: x, y: y}, scale: scale, rotation: rotation}

}

Tile.prototype.border = function(transform) {

  return _.range(7).map(function(i) {
    var dx = transform.scale * Math.cos(i * 2 * Math.PI / 6 + transform.rotation)
    var dy = transform.scale * Math.sin(i * 2 * Math.PI / 6 + transform.rotation)
    return {x: transform.position.x + dx, y: transform.position.y + dy}
  })

}

// draw hexagon given an origin(x,y) and size (arbitrary space)
Tile.prototype.draw = function(context, transform) {

  var border = this.border(transform)
  context.beginPath()
  _.forEach(border, function(point) {
    context.lineTo(point.x, point.y)
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