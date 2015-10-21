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

Tile.prototype.origin = function(camera) {

  var size = this.size * 0.1 * camera.position.z
  var x = size * 3/2 * this.position.r + camera.position.x
  var y = size * Math.sqrt(3) * (this.position.q + this.position.r/2) + camera.position.y
  var rot = camera.orientation * Math.PI / 180
  x = x * Math.cos(rot) - x * Math.sin(rot)
  y = y * Math.sin(rot) + y * Math.cos(rot)
  return {x: x, y: y, size: size, rot: rot}

}

Tile.prototype.border = function(origin) {

  return _.range(7).map(function(i) {
    var dx = origin.size * Math.cos(i * 2 * Math.PI / 6 + origin.rot)
    var dy = origin.size * Math.sin(i * 2 * Math.PI / 6 + origin.rot)
    return {x: origin.x + dx, y: origin.y + dy}
  })

}

// draw hexagon given an origin(x,y) and size (arbitrary space)
Tile.prototype.draw = function(context, origin) {

  var border = this.border(origin)
  context.beginPath()
  _.forEach(border, function(point) {
    context.lineTo(point.x, point.y)
  })
  context.closePath()
  context.fillStyle = "#DFE0E2"
  context.fill()

}

Tile.prototype.render = function(context, camera) {

  var origin = this.origin(camera)

  this.draw(context, origin)

  this.center.render(context, origin)

  this.paths.forEach(function (path) {
    path.render(context, origin)
  })

}