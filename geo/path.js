var inherits = require('inherits')
var Geometry = require('../geometry.js')

module.exports = function (opts) {
  opts = opts || {}
  var width = opts.scale || 0.25
  
  return new Geometry({
    props: {
      fill: opts.fill || '#DFE0E2',
      stroke: opts.stroke || '#DFE0E2',
      type: 'polygon'
    },

    transform: {
      position: opts.position || [0, 0],
      scale: width,
      angle: opts.angle || 0
    },

    shape: [
      [-1/2, Math.sqrt(3)/2],
      [-1/2, Math.sqrt(3)/2/width],
      [1/2, Math.sqrt(3)/2/width],
      [1/2, Math.sqrt(3)/2]
    ],

    children: opts.children
  })

}