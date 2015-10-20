_ = require('lodash')
Path = require('./path.js')

module.exports = Tile

function Tile(options){
  this.position = { 
    r: options.position.r, 
    q: options.position.q
  }
  this.objects = options.objects || [new Path({position: 0}), new Path({position: 1})]
  this.size = options.size || 50
  this.color = options.color || '#DFE0E2s'
}

Tile.prototype.pixels = function(camera) {
  var s = this.size * 0.1 * camera.position.z
  var x = s * 3/2 * this.position.r + camera.position.x
  var y = s * Math.sqrt(3) * (this.position.q + this.position.r/2) + camera.position.y
  return {x: x, y: y, s: s}
}

Tile.prototype.draw = function(context, camera) {
  var self = this

  var start = self.pixels(camera)
  var n = 6

  context.beginPath()
  
  _.range(n + 1).forEach(function(i) {
    var dx = start.s * Math.cos(i * 2 * Math.PI / n)
    var dy = start.s * Math.sin(i * 2 * Math.PI / n)
    context.lineTo(start.x + dx, start.y + dy)
  })

  context.closePath()
  context.fillStyle = "#DFE0E2"
  context.fill()
}

Tile.prototype.render = function(context, camera) {
  var self = this

  self.draw(context, camera)

  this.objects.forEach(function (object) {
    object.render(context, camera, self.pixels(camera))
  })
}