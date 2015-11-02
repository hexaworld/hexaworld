var inherits = require('inherits')
var Geometry = require('../geometry.js')

module.exports = function (opts) {
  opts = opts || {}
  var width = opts.scale || 0.25
  
  return new Geometry({
    props: {
      stroke: 'white',
      thickness: 0.5,
      type: 'line'
    },

    points: [
      [-1/2, Math.sqrt(3)/2/width], [1/2, Math.sqrt(3)/2/width],
      [-1/2, Math.sqrt(3)/2], [1/2, Math.sqrt(3)/2]
    ],

    transform: {
      scale: width,
      angle: opts.angle || 0
    },

    children: opts.children
  })

}