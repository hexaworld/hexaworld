var inherits = require('inherits')
var Geometry = require('../geometry.js')

module.exports = function (opts) {
  opts = opts || {}

  return new Geometry({
    props: {
      fill: opts.fill || '#DFE0E2',
      stroke: opts.stroke || '#DFE0E2',
      type: 'polygon'
    },

    points: [
      [-0.25/2, 0],
      [-0.25/2, Math.sqrt(3)/2],
      [0.25/2, Math.sqrt(3)/2],
      [0.25/2, 0]
    ],

    transform: {
      scale: opts.scale || 1,
      angle: opts.angle || 0
    },

    children: opts.children
  })

}