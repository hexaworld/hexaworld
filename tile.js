var _ = require('lodash')
var inherits = require('inherits')
var Geometry = require('./geometry.js')
var Transform = require('./transform.js')

module.exports = Tile
inherits(Tile, Geometry);

function Tile(props, children) {
  Geometry.call(this, props, children)
}

Tile.prototype.init = function(props) {
  this.props = {
    fill: props.fill || '#A5A5A5',
    stroke: props.stroke || '#A5A5A5'
  } 

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