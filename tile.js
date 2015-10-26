_ = require('lodash')
math = require('mathjs')
Path = require('./path.js')
Center = require('./center.js')
Transform = require('./transform.js')

module.exports = Tile

function Tile(props){
  if (!props) props = {}

  var scale = (props.size || 50)
  var x = scale * 3/2 * props.position.r
  var y = scale * Math.sqrt(3) * (props.position.q + props.position.r/2)
  
  this.position = props.position
  this.size = scale
  this.color = props.color || '#A5A5A5'
  this.parent = props.parent
  this.transform = new Transform({position: {x: x, y: y}, scale: scale})
  this.children = [
    new Path({parent: this}), 
    new Center({parent: this})
  ]
  this.init()
}

Tile.prototype.init = function() {
  var points = _.range(7).map(function(i) {
    var dx = Math.cos(i * 2 * Math.PI / 6)
    var dy = Math.sin(i * 2 * Math.PI / 6)
    return [dx, dy]
  })
  points = this.transform.apply(points)
  if (this.parent) points = this.parent.transform.apply(points)
  this.points = points
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