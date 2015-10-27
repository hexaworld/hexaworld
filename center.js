var _ = require('lodash')
var inherits = require('inherits')
var Geometry = require('./geometry.js')
var transform = require('./transform.js')

module.exports = Center
inherits(Center, Geometry)

function Center(props, children) {
  Geometry.call(this, props, children)
}

Center.prototype.init = function(props) {
  this.props = {
    fill: props.fill || '#DFE0E2',
    stroke: props.stroke || '#DFE0E2',
    type: 'circle'
  } 

  // var shape = _.range(7).map(function(i) {
  //   var dx =  Math.cos(i * 2 * Math.PI / 6)
  //   var dy =  Math.sin(i * 2 * Math.PI / 6)
  //   return [dx, dy]
  // })
  // this.shape = shape

  var shape = {center: {x: 0, y: 0}, size: 1, orientation: 0}
  this.shape = shape

  var scale = (props.scale || .25)
  this.transform = transform({scale: scale})
}
