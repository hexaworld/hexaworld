_ = require('lodash')
Path = require('./path.js')
Center = require('./center.js')
Transform = require('./transform.js')

module.exports = Tile

function Tile(props) {
  if (!props) props = {}
  
  this.coordinate = props.coordinate
  this.color = props.color || '#A5A5A5'
  this.parent = props.parent

  this.init(props)
  this.update()

  this.children = [
    new Path({parent: this}), 
    new Center({parent: this})
  ]

}

Tile.prototype.init = function(props) {
  var scale = (props.scale || 50)
  var x = scale * 3/2 * props.coordinate.r
  var y = scale * Math.sqrt(3) * (props.coordinate.q + props.coordinate.r/2)
  this.transform = new Transform({position: {x: x, y: y}, scale: scale})
  
  var points = _.range(7).map(function(i) {
    var dx = Math.cos(i * 2 * Math.PI / 6)
    var dy = Math.sin(i * 2 * Math.PI / 6)
    return [dx, dy]
  })
  this.points = points
}

Tile.prototype.update = function() {
  var self = this
  self.points = self.transform.apply(self.points)
  if (self.parent) self.points = self.parent.transform.apply(self.points)
}

Tile.prototype.draw = function(context, points) {
  context.beginPath()
  _.forEach(points, function(point) {
    context.lineTo(point[0], point[1])
  })
  context.closePath()
  context.fillStyle = this.color
  context.strokeStyle = this.color
  context.fill()
  context.stroke()
}

Tile.prototype.render = function(context, camera) {
  var points = this.points
  points = camera.transform.apply(points)
  this.draw(context, points)
  this.children.forEach(function (child) {
    child.render(context, camera)
  })
}