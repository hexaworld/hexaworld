var inherits = require('inherits')
var Geometry = require('./geometry.js')
var Transform = require('./transform.js')

module.exports = Path
inherits(Path, Geometry)

function Path(props, children) {
  Geometry.call(this, props, children)
}

Path.prototype.init = function(props) {
  
  this.props = {
    fill: props.fill || '#DFE0E2',
    stroke: props.stroke || '#DFE0E2'
  } 

  
  var scale = (props.scale || 1)
  var rotation = (props.rotation || 0)
  this.transform = new Transform({scale: scale, rotation:rotation})

  var points = [
    [-.2/2, 0],
    [-.2/2, Math.sqrt(3)/2],
    [.2/2, Math.sqrt(3)/2],
    [.2/2, 0]
  ]
  this.points = points
}