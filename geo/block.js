var inherits = require('inherits')
var Geometry = require('../geometry.js')

module.exports = function (opts) {
  opts = opts || {}
  var width = opts.scale || 0.25
  
  return new Geometry({
    props: {
      fill: opts.fill || '#A5A5A5',
      stroke: opts.stroke || '#A5A5A5',
      thickness: 2,
      type: 'polygon'
    },

    points: [
      [-1/2, Math.sqrt(3)/2],
      [-1/2, Math.sqrt(3)/2/width],
      [1/2, Math.sqrt(3)/2/width],
      [1/2, Math.sqrt(3)/2]
    ],

    transform: {
      scale: width,
      angle: opts.angle || 0
    },

    children: opts.children, 

    obstacle: true
  })

}