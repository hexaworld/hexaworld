var _ = require('lodash')
var inherits = require('inherits')
var Geometry = require('./geometry.js')
var Transform = require('./transform.js')

module.exports = Center
inherits(Center, Geometry)

function Center(props, children) {
  Geometry.call(this, props, children)
}

Center.prototype.init = function(props) {
  this.props = {
    fill: props.fill || '#DFE0E2',
    stroke: props.stroke || '#DFE0E2'
  } 

  var points = _.range(7).map(function(i) {
    var dx =  Math.cos(i * 2 * Math.PI / 6)
    var dy =  Math.sin(i * 2 * Math.PI / 6)
    return [dx, dy]
  })
  this.points = points

  var scale = (props.scale || .25)
  this.transform = new Transform({scale: scale})
}
